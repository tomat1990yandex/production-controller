import React from 'react';
import { CardType, CardStatus } from '../types';
import { CardItem } from "./CardItem.tsx";

interface CardListProps {
    cards: CardType[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, key: keyof CardType, value: string | CardStatus) => void;
}

export const CardList: React.FC<CardListProps> = ({ cards, onDelete, onUpdate }) => {
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
      </div>
    );
};
