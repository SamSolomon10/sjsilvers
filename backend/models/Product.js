import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    metal: { type: String, required: true },
    purity: { type: String, required: true },
    weight: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    makingCharges: { type: Number, required: true },
    images: [{ url: String }],
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'] },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
