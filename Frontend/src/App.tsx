import React, { useState } from 'react';
import { CardStatus, CardType } from './types';
import './App.css';
import { CardList } from "./components/CardList.tsx";

const initialCards: CardType[] = [
    { id: 1, title: 'Card 1', status: 'green', text: '', isEditing: false },
    { id: 2, title: 'Card 2', status: 'yellow', text: '', isEditing: false },
];

export const App: React.FC = () => {
    const [cards, setCards] = useState<CardType[]>(initialCards);

    const addCard = (): void => {
        const newCard: CardType = {
            id: Date.now(),
            title: 'New Card',
            status: 'green',
            text: '',
            isEditing: true
        };
        setCards([...cards, newCard]);
    };

    const deleteCard = (id: number): void => {
        setCards(cards.filter(card => card.id !== id));
    };

    const updateCard = (id: number, key: keyof CardType, value: string | CardStatus | boolean): void => {
        setCards(cards.map(card => card.id === id ? { ...card, [key]: value } : card));
    };

    return (
      <div className="app-container">
          <CardList
            cards={cards}
            onDelete={deleteCard}
            onUpdate={updateCard}
            onAddCard={addCard}
          />
      </div>
    );
};
