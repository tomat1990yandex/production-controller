import { Request, Response } from 'express';
import { createCard, deleteCard, findAllCards, updateCard } from '../services/cardService';

export const getCards = async (req: Request, res: Response): Promise<void> => {
    try {
        const cards = await findAllCards();
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createCardHandler = async (req: Request, res: Response) => {
    const { title, status, text } = req.body;
    try {
        const newCard = await createCard({ title, status, text });
        res.status(201).json(newCard);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateCardHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, status, text } = req.body;

    try {
        const card = await updateCard(id, { title, status, text });
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        res.status(200).json(card);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteCardHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const card = await deleteCard(id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        res.status(200).json({ message: 'Card deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
