import React, { useState, ChangeEvent } from 'react';
import { CardType, CardStatus } from './types';

import './App.css';
import { AddCardForm } from "./components/AddCardForm.tsx";
import { CardList } from "./components/CardList.tsx";

const initialCards: CardType[] = [
    { id: 1, title: 'Card 1', status: 'green', text: '', isEditing: false },
    { id: 2, title: 'Card 2', status: 'yellow', text: '', isEditing: false },
];

export const App: React.FC = () => {
    const [cards, setCards] = useState<CardType[]>(initialCards);
    const [newCardTitle, setNewCardTitle] = useState<string>('');

    const addCard = (): void => {
        const newCard: CardType = {
            id: Date.now(),
            title: newCardTitle || 'New Card',
            status: 'green',
            text: '',
            isEditing: false
        };
        setCards([...cards, newCard]);
        setNewCardTitle('');
    };

    const deleteCard = (id: number): void => {
        setCards(cards.filter(card => card.id !== id));
    };

    const updateCard = (id: number, key: keyof CardType, value: string | CardStatus | boolean): void => {
        setCards(cards.map(card => card.id === id ? { ...card, [key]: value } : card));
    };

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setNewCardTitle(e.target.value);
    };

    return (
      <div className="app-container">
          <AddCardForm
            newCardTitle={newCardTitle}
            onTitleChange={handleTitleChange}
            onAddCard={addCard}
          />
          <CardList
            cards={cards}
            onDelete={deleteCard}
            onUpdate={updateCard}
          />
      </div>
    );
};
