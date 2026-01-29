import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 12;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.search
            ? {
                name: {
                    $regex: req.query.search,
                    $options: 'i',
                },
            }
            : {};

        const filters = { ...keyword };
        if (req.query.category) filters.category = req.query.category;
        if (req.query.metal) filters.metal = req.query.metal;
        if (req.query.purity) filters.purity = req.query.purity;
        if (req.query.gender) filters.gender = req.query.gender;
        if (req.query.featured === 'true') filters.featured = true;

        if (req.query.minPrice || req.query.maxPrice) {
            filters.basePrice = {};
            if (req.query.minPrice) filters.basePrice.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filters.basePrice.$lte = Number(req.query.maxPrice);
        }

        let sort = { createdAt: -1 };
        if (req.query.sort === 'price-asc') sort = { basePrice: 1 };
        if (req.query.sort === 'price-desc') sort = { basePrice: -1 };
        if (req.query.sort === 'rating') sort = { rating: -1 };

        const count = await Product.countDocuments(filters);
        const products = await Product.find(filters)
            .sort(sort)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, pagination: { page, pages: Math.ceil(count / pageSize), total: count } });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json({ product: createdProduct });
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json({ product: updatedProduct });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
