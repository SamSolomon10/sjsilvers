import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { fetchCart } from './redux/slices/cartSlice';
import { getCurrentUser } from './redux/slices/authSlice';

import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductForm from './components/admin/ProductForm';
import ProductList from './components/admin/ProductList';

import './index.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
      dispatch(fetchCart());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="app">
        <Header onCartOpen={() => setIsCartOpen(true)} />
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <main style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* User Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="orders" element={<Orders />} />
              <Route path="wishlist" element={<Wishlist />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="products" element={<ProductList />} />
              <Route path="orders" element={<div><h2>Manage Orders</h2><p>Order management coming soon</p></div>} />
              <Route path="add-product" element={<ProductForm />} />
              <Route path="edit-product/:id" element={<ProductForm />} />
            </Route>
          </Routes>
        </main>

        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
