import { Router } from 'express';
import { createCardHandler, deleteCardHandler, getCards, updateCardHandler } from '../controllers/cardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCards);
router.post('/', authMiddleware, createCardHandler);
router.put('/:id', authMiddleware, updateCardHandler);
router.delete('/:id', authMiddleware, deleteCardHandler);

export default router;
