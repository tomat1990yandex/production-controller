import { CardType } from '../types';
import { notification } from 'antd';
import { Dispatch, SetStateAction } from 'react';

interface CardActionsProps {
  ws: WebSocket | null;
  token: string | null | undefined;
  setCards: Dispatch<SetStateAction<CardType[]>>;
}

const showErrorNotification = (title: string, message: string) => {
  notification.error({
    message: title,
    description: message
  });
};

export const addCard = (
  { ws, token, setCards }: CardActionsProps,
  newCard: CardType
): void => {
  if (!token) return;

  ws?.send(JSON.stringify({ action: 'createCard', payload: newCard, token }));

  ws?.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log(message);
    if (message.action === 'createCard') {
      setCards((prevCards) => [...prevCards, message.payload]);
    } else if (message.action === 'error') {
      showErrorNotification(message.payload, message.message);
    }
  });
};

export const deleteCard = (
  { ws, token, setCards }: CardActionsProps,
  id: number
): void => {
  if (!token) return;

  ws?.send(JSON.stringify({ action: 'deleteCard', payload: { _id: id }, token }));

  ws?.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.action === 'deleteCard') {
      setCards((prevCards) => prevCards.filter((card) => card._id !== id));
    } else if (message.action === 'error') {
      showErrorNotification(message.payload, message.message);
    }
  });
};

export const updateCard = (
  { ws, token, setCards }: CardActionsProps,
  id: number,
  updatedCard: Partial<CardType>
): void => {
  if (!token) return;

  setCards((prevCards) => {
    const cardToUpdate = prevCards.find((card) => card._id === id);
    if (cardToUpdate) {
      Object.assign(cardToUpdate, updatedCard);
      ws?.send(JSON.stringify({ action: 'updateCard', payload: cardToUpdate, token }));
    }
    return [...prevCards];
  });

  ws?.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.action === 'updateCard') {
      setCards((prevCards) =>
        prevCards.map((card) => (card._id === id ? message.payload : card))
      );
    } else if (message.action === 'error') {
      showErrorNotification(message.payload, message.message);
    }
  });
};
