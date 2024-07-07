import React from 'react';
import { Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CardStatus, CardType } from '../types';
import { CardItem } from "./CardItem.tsx";

interface CardListProps {
    cards: CardType[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, key: keyof CardType, value: string | CardStatus | boolean) => void;
    onAddCard: () => void;
}

export const CardList: React.FC<CardListProps> = ({ cards, onDelete, onUpdate, onAddCard }) => {
    return (
      <div className="cards-container">
          {cards.map(card => (
            <CardItem
              key={card.id}
              card={card}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
          <Card
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
                cursor: 'pointer',
                border: '2px dashed #d9d9d9',
                marginBottom: '10px'
            }}
            onClick={onAddCard}
          >
              <PlusOutlined style={{ fontSize: '24px', color: '#d9d9d9' }} />
          </Card>
      </div>
    );
};
