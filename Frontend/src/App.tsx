import React, { useEffect, useState } from 'react';
import { CardStatus, CardType } from './types';
import './App.css';
import { CardList } from "./components/CardList.tsx";

const initialCards: CardType[] = [];

export const App: React.FC = () => {
    const [cards, setCards] = useState<CardType[]>(initialCards);
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
            socket.send(JSON.stringify({ action: 'getCards' }));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.action === 'getCards') {
                setCards(message.payload);
            } else if (message.action === 'createCard') {
                setCards(prevCards => [...prevCards, message.payload]);
            } else if (message.action === 'updateCard') {
                setCards(prevCards => prevCards.map(card => card.id === message.payload.id ? message.payload : card));
            } else if (message.action === 'deleteCard') {
                setCards(prevCards => prevCards.filter(card => card.id !== message.payload));
            }
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        socket.onerror = (error) => {
            console.log('WebSocket error:', error);
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const addCard = (): void => {
        const newCard: CardType = {
            id: Date.now(),
            title: 'New Card',
            status: 'green',
            text: '',
            isEditing: true
        };
        setCards([...cards, newCard]);
        ws?.send(JSON.stringify({ action: 'createCard', payload: newCard }));
    };

    const deleteCard = (id: number): void => {
        setCards(cards.filter(card => card.id !== id));
        ws?.send(JSON.stringify({ action: 'deleteCard', payload: { id } }));
    };

    const updateCard = (id: number, key: keyof CardType, value: string | CardStatus | boolean): void => {
        const updatedCards = cards.map(card => card.id === id ? { ...card, [key]: value } : card);
        setCards(updatedCards);
        const updatedCard = updatedCards.find(card => card.id === id);
        if (updatedCard) {
            ws?.send(JSON.stringify({ action: 'updateCard', payload: updatedCard }));
        }
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
