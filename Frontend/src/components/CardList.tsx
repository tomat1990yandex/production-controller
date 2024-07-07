import React from 'react';
import { Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CardType } from '../types';
import { CardItem } from "./CardItem.tsx";

interface CardListProps {
    cards: CardType[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, updatedCard: Partial<CardType>) => void;
    onAddCard: () => void;
    isAuthenticated: boolean;
}

export const CardList: React.FC<CardListProps> = ({ cards, onDelete, onUpdate, onAddCard, isAuthenticated}) => {
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
            <Card
              style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '2px dashed #d9d9d9',
                  marginBottom: '10px'
              }}
              onClick={onAddCard}
            >
                <PlusOutlined style={{ fontSize: '24px', color: '#d9d9d9' }} />
            </Card>
          )}
      </div>
    );
};
