import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CardType } from './types';
import './App.css';
import { CardList } from './components/CardList';
import { AuthForm } from './components/AuthForm';
import { AuthContext } from './contexts/AuthContext';
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
                  prevCards.map((card) => (card._id === message.payload._id ? message.payload : card))
                );
            } else if (message.action === 'deleteCard') {
                setCards((prevCards) => prevCards.filter((card) => card._id !== message.payload));
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
            title: 'New Card',
            status: 'green',
            text: '',
        };
        ws?.send(JSON.stringify({ action: 'createCard', payload: newCard, token: authContext.token }));
    };

    const deleteCard = (id: number): void => {
        if (!authContext?.token) return;
        ws?.send(JSON.stringify({ action: 'deleteCard', payload: { _id: id }, token: authContext.token }));
    };

    const updateCard = (id: number, updatedCard: Partial<CardType>): void => {
        if (!authContext?.token) return;
        const updatedCards = cards.map((card) => (card._id === id ? { ...card, ...updatedCard } : card));
        setCards(updatedCards);
        const cardToUpdate = updatedCards.find((card) => card._id === id);
        if (cardToUpdate) {
            ws?.send(JSON.stringify({ action: 'updateCard', payload: cardToUpdate, token: authContext.token }));
        }
    };

    return (
      <Routes>
          <Route path="/" element={
              <div className="app-container">
                  <header className={'header-container'}>
                      {!authContext?.token
                        ? <AuthForm/>
                        : <Button onClick={authContext.logout}>Logout</Button>
                      }
                  </header>
                  <main>
                      <CardList
                        cards={cards}
                        onDelete={deleteCard}
                        onUpdate={updateCard}
                        onAddCard={addCard}
                        isAuthenticated={!!authContext?.token}
                      />
                  </main>
              </div>
          }/>
          <Route path="/admin" element={<AuthForm/>}/>
      </Routes>
    );
};
