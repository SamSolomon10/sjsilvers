import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const initialState = {
    orders: [],
    currentOrder: null,
    adminOrders: [],
    pagination: {
        page: 1,
        limit: 10,
        total: 0
    },
    isLoading: false,
    error: null
};

// Create order
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async ({ shippingAddress, paymentMethod }, { getState, rejectWithValue }) => {
        try {
            const { user, token } = getState().auth;
            const response = await axios.post(`${API_URL}/orders`, {
                userId: user.id,
                shippingAddress,
                paymentMethod
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

// Fetch user orders
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user, token } = getState().auth;
            const response = await axios.get(`${API_URL}/orders/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.orders;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

// Fetch single order
export const fetchOrder = createAsyncThunk(
    'orders/fetchOrder',
    async (orderId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(`${API_URL}/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Order not found');
        }
    }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
    'orders/cancelOrder',
    async (orderId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.put(`${API_URL}/orders/${orderId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
        }
    }
);

// Admin: Fetch all orders
export const fetchAdminOrders = createAsyncThunk(
    'orders/fetchAdminOrders',
    async ({ page = 1, status = '' }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const params = new URLSearchParams({ page, limit: 20 });
            if (status) params.append('status', status);

            const response = await axios.get(`${API_URL}/orders?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

// Admin: Update order status
export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ orderId, status, trackingNumber }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.put(`${API_URL}/orders/${orderId}/status`, {
                status,
                trackingNumber
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update order');
        }
    }
);

// Create Razorpay order
export const createPaymentOrder = createAsyncThunk(
    'orders/createPaymentOrder',
    async ({ amount, orderId }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/payment/create-order`, {
                amount,
                orderId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create payment');
        }
    }
);

// Verify payment
export const verifyPayment = createAsyncThunk(
    'orders/verifyPayment',
    async (paymentData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/payment/verify`, paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload;
                state.orders.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload || [];
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch single order
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
            })
            // Cancel order
            .addCase(cancelOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                if (state.currentOrder?._id === action.payload._id) {
                    state.currentOrder = action.payload;
                }
            })
            // Admin: Fetch all orders
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.adminOrders = action.payload.orders || [];
                state.pagination = action.payload.pagination || state.pagination;
            })
            // Admin: Update order status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.adminOrders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.adminOrders[index] = action.payload;
                }
            });
    }
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
