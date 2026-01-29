import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import paymentRoutes from './routes/payment.js';
// Import models for stats/seeding
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);

// Admin Stats Route
app.get('/api/admin/stats', async (req, res) => {
    try {
        const [totalUsers, totalProducts, orders] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Product.countDocuments(),
            Order.find()
        ]);

        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        const totalOrders = orders.length;

        res.json({
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

// Seed Route (Dev only)
app.post('/api/seed', async (req, res) => {
    try {
        const sampleProducts = [
            {
                name: "Classic Gold Chain",
                description: "22K Yellow Gold Chain, perfect for daily wear. Elegant and durable.",
                category: "chains",
                metal: "gold",
                purity: "22K",
                weight: 15.5,
                basePrice: 85000,
                makingCharges: 5000,
                images: [{ url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500" }],
                stock: 10,
                sku: "CHN-001",
                gender: "unisex"
            },
            {
                name: "Diamond Studded Ring",
                description: "18K Gold ring with certified VVS diamonds. A symbol of eternal love.",
                category: "rings",
                metal: "gold",
                purity: "18K",
                weight: 4.2,
                basePrice: 45000,
                makingCharges: 3000,
                images: [{ url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500" }],
                stock: 5,
                sku: "RNG-002",
                gender: "women",
                featured: true
            },
            {
                name: "Silver Oxidized Bangles",
                description: "Traditional 925 Sterling Silver oxidized bangles with intricate antique design.",
                category: "bangles",
                metal: "silver",
                purity: "925",
                weight: 45,
                basePrice: 8500,
                makingCharges: 1000,
                images: [{ url: "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=500" }],
                stock: 20,
                sku: "BNG-003",
                gender: "women"
            }
        ];

        await Product.deleteMany({});
        await Product.insertMany(sampleProducts);

        res.json({ message: 'Database seeded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send('SJSilvers API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
