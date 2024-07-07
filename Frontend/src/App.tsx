import React, { useContext, useEffect, useState } from 'react';
import { CardStatus, CardType } from './types';
import './App.css';
import { CardList } from './components/CardList';
import { AuthForm } from './components/AuthForm';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { Button } from "antd";

const initialCards: CardType[] = [];

export const App: React.FC = () => {
    const [cards, setCards] = useState<CardType[]>(initialCards);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const authContext = useContext(AuthContext);

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
                setCards((prevCards) => [...prevCards, message.payload]);
            } else if (message.action === 'updateCard') {
                setCards((prevCards) =>
                  prevCards.map((card) => (card._id === message.payload.id ? message.payload : card))
                );
            } else if (message.action === 'deleteCard') {
                setCards((prevCards) => prevCards.filter((card) => card._id !== message.payload.id));
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
        if (!authContext?.token) return;
        const newCard: CardType = {
            _id: Date.now(),
            title: 'New Card',
            status: 'green',
            text: '',
            isEditing: true,
        };
        setCards([...cards, newCard]);
        ws?.send(JSON.stringify({ action: 'createCard', payload: newCard, token: authContext.token }));
    };

    const deleteCard = (id: number): void => {
        if (!authContext?.token) return;
        setCards(cards.filter((card) => card._id !== id));
        ws?.send(JSON.stringify({ action: 'deleteCard', payload: { id }, token: authContext.token }));
    };

    const updateCard = (id: number, key: keyof CardType, value: string | CardStatus | boolean): void => {
        if (!authContext?.token) return;
        const updatedCards = cards.map((card) => (card._id === id ? { ...card, [key]: value } : card));
        setCards(updatedCards);
        const updatedCard = updatedCards.find((card) => card._id === id);
        if (updatedCard) {
            ws?.send(JSON.stringify({ action: 'updateCard', payload: updatedCard, token: authContext.token }));
        }
    };

    return (
      <div className="app-container">
          {!authContext?.token ? (
            <>
                <AuthForm/>
                <CardList cards={cards} onDelete={deleteCard} onUpdate={updateCard} onAddCard={addCard}/>
            </>
          ) : (
            <>
                <Button onClick={authContext.logout}>Logout</Button>
                <CardList cards={cards} onDelete={deleteCard} onUpdate={updateCard} onAddCard={addCard}/>
            </>
          )}
      </div>
    );
};

export const WrappedApp: React.FC = () => (
  <AuthProvider>
      <App/>
  </AuthProvider>
);
