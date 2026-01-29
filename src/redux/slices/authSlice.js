import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Check for stored user
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

let parsedUser = null;
try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem('user');
}

const initialState = {
    user: parsedUser,
    token: storedToken || null,
    isLoading: false,
    error: null
};

// Register
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get user');
        }
    }
);

// Update profile
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, { getState, rejectWithValue }) => {
        try {
            const { token, user } = getState().auth;
            const response = await axios.put(`${API_URL}/users/profile/${user.id}`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedUser = { ...user, ...response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Update failed');
        }
    }
);

// Add address
export const addAddress = createAsyncThunk(
    'auth/addAddress',
    async (addressData, { getState, rejectWithValue }) => {
        try {
            const { token, user } = getState().auth;
            const response = await axios.post(`${API_URL}/users/address/${user.id}`, addressData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.addresses;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add address');
        }
    }
);

// Toggle wishlist
export const toggleWishlist = createAsyncThunk(
    'auth/toggleWishlist',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const { token, user } = getState().auth;
            const isInWishlist = user.wishlist?.some(item =>
                (typeof item === 'string' ? item : item._id) === productId
            );

            if (isInWishlist) {
                const response = await axios.delete(`${API_URL}/users/wishlist/${user.id}/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.data.wishlist;
            } else {
                const response = await axios.post(`${API_URL}/users/wishlist/${user.id}`, { productId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.data.wishlist;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get current user
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            // Update profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            // Add address
            .addCase(addAddress.fulfilled, (state, action) => {
                state.user = { ...state.user, addresses: action.payload };
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            // Toggle wishlist
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                state.user = { ...state.user, wishlist: action.payload || [] };
                localStorage.setItem('user', JSON.stringify(state.user));
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
