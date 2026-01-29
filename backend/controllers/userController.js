import User from '../models/User.js';
import Product from '../models/Product.js'; // Ensure Product is registered

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        if (user) {
            res.json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    wishlist: user.wishlist,
                    addresses: user.addresses
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile/:id
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    wishlist: updatedUser.wishlist,
                    addresses: updatedUser.addresses
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/:id
// @access  Private
// NOTE: This handles both add and remove for simplicity or specific add
export const addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { productId } = req.body;

        if (user) {
            if (!user.wishlist.includes(productId)) {
                user.wishlist.push(productId);
                await user.save();
            }
            // Populate wishlist before returning
            await user.populate('wishlist');
            res.json({ wishlist: user.wishlist });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:id/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
            await user.save();
            await user.populate('wishlist');
            res.json({ wishlist: user.wishlist });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add address
// @route   POST /api/users/address/:id
// @access  Private
export const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.addresses.push(req.body);
            await user.save();
            res.json({ addresses: user.addresses });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
