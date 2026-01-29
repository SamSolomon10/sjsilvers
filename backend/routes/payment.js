import express from 'express';
const router = express.Router();

router.post('/create-order', (req, res) => res.json({ id: 'dummy_order_id' }));

export default router;
