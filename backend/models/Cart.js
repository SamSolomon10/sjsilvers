import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String
        },
        name: {
            type: String
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

cartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Cart', cartSchema);
