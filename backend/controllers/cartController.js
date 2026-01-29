import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart/:userId
// @access  Private
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) {
            cart = await Cart.create({ user: req.params.userId, items: [] });
        }
        res.json({ cart });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock' });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        const price = (product.basePrice + product.makingCharges) - ((product.basePrice * (product.discount || 0)) / 100);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].price = price; // Update price in case it changed
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price,
                name: product.name,
                image: product.images[0]?.url
            });
        }

        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        await cart.save();

        res.json({ cart });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                const product = await Product.findById(productId);
                if (product.stock < quantity) {
                    return res.status(400).json({ message: 'Not enough stock' });
                }
                cart.items[itemIndex].quantity = quantity;
            }

            cart.totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
            await cart.save();
            res.json({ cart });
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
export const removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        await cart.save();
        res.json({ cart });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear/:userId
// @access  Private
export const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.params.userId });
        if (cart) {
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
