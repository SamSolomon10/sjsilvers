import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove', protect, removeFromCart);
router.delete('/clear/:userId', protect, clearCart);

export default router;
