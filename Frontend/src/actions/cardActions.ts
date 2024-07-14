import { CardType } from '../types';
import { Dispatch, SetStateAction } from 'react';

interface CardActionsProps {
  ws: WebSocket | null;
  token: string | null | undefined;
  logout?: () => void;
  setCards: Dispatch<SetStateAction<CardType[]>>;
}

export const addCard = (
  { ws, token }: CardActionsProps,
  newCard: CardType
): void => {
  if (!token) return;

  ws?.send(JSON.stringify({ action: 'createCard', payload: newCard, token }));
};

export const deleteCard = (
  { ws, token, logout }: CardActionsProps,
  id: string
): void => {
  if (!token) return;

  ws?.send(JSON.stringify({ action: 'deleteCard', payload: { _id: id }, token }));

  ws?.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.action === 'error') {
      if (message.payload === "Неавторизованный запрос") if (logout) {
        logout();
      }
    }
  });
};

export const updateCard = (
  { ws, token, setCards }: CardActionsProps,
  id: string,
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
};
