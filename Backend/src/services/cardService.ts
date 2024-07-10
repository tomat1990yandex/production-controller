import { Card, ICard } from '../models/cardModel';

export const findAllCards = async (): Promise<ICard[]> => {
    return Card.find().populate('group');
};

export const createCard = async (card: Partial<ICard>): Promise<ICard> => {
    return Card.create(card);
};

export const updateCard = async (id: string, card: Partial<ICard>): Promise<ICard | null> => {
    return Card.findByIdAndUpdate(id, card, { new: true });
};

export const deleteCard = async (id: string): Promise<ICard | null> => {
    return Card.findByIdAndDelete(id);
};
