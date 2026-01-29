import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                wishlist: user.wishlist,
                addresses: user.addresses
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email }).populate('wishlist');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                wishlist: user.wishlist,
                addresses: user.addresses
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get Current User (Me)
router.get('/me', async (req, res) => {
    // Basic implementation, ideally needs auth middleware
    // We'll trust the token verification to a middleware but for now:
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.userId).select('-password').populate('wishlist');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
});

export default router;
