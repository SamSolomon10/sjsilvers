import express from 'express';
import { updateUserProfile, addToWishlist, removeFromWishlist, addAddress } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile/:id', protect, updateUserProfile);
router.post('/address/:id', protect, addAddress);
router.post('/wishlist/:id', protect, addToWishlist);
router.delete('/wishlist/:id/:productId', protect, removeFromWishlist);

export default router;
