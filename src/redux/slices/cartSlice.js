import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const initialState = {
    items: [],
    totalAmount: 0,
    isLoading: false,
    error: null
};

// Fetch cart
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().auth;
            if (!user) return { items: [], totalAmount: 0 };

            const response = await axios.get(`${API_URL}/cart/${user.id}`);
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

// Add to cart
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().auth;
            if (!user) {
                return rejectWithValue('Please login to add items to cart');
            }

            const response = await axios.post(`${API_URL}/cart/add`, {
                userId: user.id,
                productId,
                quantity
            });
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
        }
    }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ productId, quantity }, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().auth;
            const response = await axios.put(`${API_URL}/cart/update`, {
                userId: user.id,
                productId,
                quantity
            });
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
        }
    }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().auth;
            const response = await axios.delete(`${API_URL}/cart/remove`, {
                data: { userId: user.id, productId }
            });
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
        }
    }
);

// Clear cart
export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().auth;
            await axios.delete(`${API_URL}/cart/clear/${user.id}`);
            return { items: [], totalAmount: 0 };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.items || [];
                state.totalAmount = action.payload.totalAmount || 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.items || [];
                state.totalAmount = action.payload.totalAmount || 0;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update cart item
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.totalAmount = action.payload.totalAmount || 0;
            })
            // Remove from cart
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.totalAmount = action.payload.totalAmount || 0;
            })
            // Clear cart
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.totalAmount = 0;
            });
    }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
