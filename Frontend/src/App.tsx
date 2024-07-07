import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CardType, CardStatus } from './types';
import './App.css';
import { CardList } from "./components/CardList.tsx";

export const App: React.FC = () => {
    const [cards, setCards] = useState<CardType[]>([]);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.get('/api/cards', {
                headers: { Authorization: `Bearer ${token}` }
            })
              .then(response => {
                  setCards(response.data);
              })
              .catch(error => {
                  console.error(error);
              });
        }
    }, [token]);

    const addCard = (): void => {
        const newCard: Partial<CardType> = {
            title: 'New Card',
            status: 'green',
            text: '',
            isEditing: true
        };

        if (token) {
            axios.post('/api/cards', newCard, {
                headers: { Authorization: `Bearer ${token}` }
            })
              .then(response => {
                  setCards([...cards, response.data]);
              })
              .catch(error => {
                  console.error(error);
              });
        }
    };

    const deleteCard = (id: number): void => {
        if (token) {
            axios.delete(`/api/cards/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
              .then(() => {
                  setCards(cards.filter(card => card.id !== id));
              })
              .catch(error => {
                  console.error(error);
              });
        }
    };

    const updateCard = (id: number, key: keyof CardType, value: string | CardStatus | boolean): void => {
        const updatedCard = cards.find(card => card.id === id);
        if (updatedCard) {
            updatedCard[key] = value as any;
            setCards([...cards]);

            if (token) {
                axios.put(`/api/cards/${id}`, updatedCard, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                  .then(response => {
                      setCards(cards.map(card => card.id === id ? response.data : card));
                  })
                  .catch(error => {
                      console.error(error);
                  });
            }
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
