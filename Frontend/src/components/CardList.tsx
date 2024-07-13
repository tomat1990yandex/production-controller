import { FC } from 'react';
import { CardType } from '../types';
import { CardItem } from './CardItem.tsx';

interface CardListProps {
  cards: CardType[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedCard: Partial<CardType>) => void;
  isAuthenticated: boolean;
}

export const CardList: FC<CardListProps> = ({ cards, onDelete, onUpdate, isAuthenticated }) => {
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
    </div>
  );
};
