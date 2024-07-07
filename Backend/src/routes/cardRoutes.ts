import { Router } from 'express';
import { getCards, createCardHandler, updateCardHandler, deleteCardHandler } from '../controllers/cardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getCards);
router.post('/', createCardHandler);
router.put('/:id', updateCardHandler);
router.delete('/:id', deleteCardHandler);

export default router;
