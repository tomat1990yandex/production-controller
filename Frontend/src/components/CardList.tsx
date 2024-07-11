import { Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CardType } from '../types';
import { CardItem } from "./CardItem";
import { FC } from "react";

interface CardListProps {
    cards: CardType[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, updatedCard: Partial<CardType>) => void;
    onAddCard: () => void;
    isAuthenticated: boolean;
}

export const CardList: FC<CardListProps> = ({ cards, onDelete, onUpdate, onAddCard, isAuthenticated }) => {
    console.log(cards);
    return (
      <div className="cards-container">
          {cards.map(card => (
            <CardItem
              key={card._id}
              card={card}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isAuthenticated={isAuthenticated}
            />
          ))}
          {isAuthenticated && (
            <Card onClick={onAddCard}
                  className="add-card">
                <PlusOutlined style={{ fontSize: '24px', color: '#d9d9d9' }}/>
            </Card>
          )}
      </div>
    );
};
