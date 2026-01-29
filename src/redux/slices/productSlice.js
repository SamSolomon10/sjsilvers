import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const initialState = {
    products: [],
    featuredProducts: [],
    currentProduct: null,
    reviews: [],
    pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
    },
    filters: {
        category: '',
        metal: '',
        purity: '',
        minPrice: '',
        maxPrice: '',
        gender: '',
        sort: 'newest',
        search: ''
    },
    livePrices: null,
    isLoading: false,
    error: null
};

// Fetch products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { filters, pagination } = getState().products;
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            params.append('page', pagination.page);
            params.append('limit', pagination.limit);

            const response = await axios.get(`${API_URL}/products?${params}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

// Fetch featured products
export const fetchFeaturedProducts = createAsyncThunk(
    'products/fetchFeaturedProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/products?featured=true&limit=8`);
            return response.data.products;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
        }
    }
);

// Fetch single product
export const fetchProduct = createAsyncThunk(
    'products/fetchProduct',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/products/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Product not found');
        }
    }
);

// Fetch live prices
export const fetchLivePrices = createAsyncThunk(
    'products/fetchLivePrices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/payment/prices`);
            return response.data.prices;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch prices');
        }
    }
);

// Add review
export const addReview = createAsyncThunk(
    'products/addReview',
    async ({ productId, reviewData }, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().auth;
            const response = await axios.post(`${API_URL}/products/${productId}/reviews`, {
                ...reviewData,
                userId: user.id,
                userName: user.name
            });
            return response.data.review;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add review');
        }
    }
);

// Admin: Create product
export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (productData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/products`, productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create product');
        }
    }
);

// Admin: Update product
export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ productId, productData }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.put(`${API_URL}/products/${productId}`, productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update product');
        }
    }
);

// Admin: Delete product
export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            await axios.delete(`${API_URL}/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return productId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 1; // Reset to page 1 when filters change
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
            state.pagination.page = 1;
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
            state.reviews = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.products || [];
                state.pagination = action.payload.pagination || state.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch featured products
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.featuredProducts = action.payload;
            })
            // Fetch single product
            .addCase(fetchProduct.pending, (state) => {
                state.isLoading = true;
                state.currentProduct = null;
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentProduct = action.payload.product;
                state.reviews = action.payload.reviews || [];
            })
            .addCase(fetchProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch live prices
            .addCase(fetchLivePrices.fulfilled, (state, action) => {
                state.livePrices = action.payload;
            })
            // Add review
            .addCase(addReview.fulfilled, (state, action) => {
                state.reviews.unshift(action.payload);
            })
            // Create product
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.unshift(action.payload);
            })
            // Update product
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            // Delete product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p._id !== action.payload);
            });
    }
});

export const { setFilters, clearFilters, setPage, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
