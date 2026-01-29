import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
    }],
    totalAmount: Number,
    status: { type: String, default: 'pending' },
    shippingAddress: Object,
    paymentStatus: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
