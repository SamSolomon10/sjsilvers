import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi';
import { createOrder, createPaymentOrder, verifyPayment } from '../redux/slices/orderSlice';
import { fetchCart, resetCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { items, totalAmount } = useSelector(state => state.cart);
    const { isLoading } = useSelector(state => state.orders);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [address, setAddress] = useState({
        fullName: user?.name || '', phone: '', addressLine1: '', addressLine2: '',
        city: '', state: '', pincode: ''
    });

    useEffect(() => { dispatch(fetchCart()); }, [dispatch]);
    useEffect(() => { if (!user) navigate('/login', { state: { from: { pathname: '/checkout' } } }); }, [user, navigate]);

    const shippingCharges = totalAmount > 50000 ? 0 : 500;
    const tax = Math.round(totalAmount * 0.03);
    const grandTotal = totalAmount + shippingCharges + tax;

    const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderResult = await dispatch(createOrder({ shippingAddress: address, paymentMethod })).unwrap();
            if (paymentMethod === 'cod') {
                toast.success('Order placed successfully!');
                dispatch(resetCart());
                navigate(`/dashboard/orders`);
            } else {
                const paymentResult = await dispatch(createPaymentOrder({ amount: orderResult.totalAmount, orderId: orderResult._id })).unwrap();
                toast.success('Order created! (Demo: Payment simulated)');
                await dispatch(verifyPayment({ orderId: orderResult._id, razorpay_order_id: paymentResult.order.id, razorpay_payment_id: 'pay_demo', razorpay_signature: 'sig_demo' }));
                dispatch(resetCart());
                navigate(`/dashboard/orders`);
            }
        } catch (error) { toast.error(error.message || 'Checkout failed'); }
    };

    if (items.length === 0) return (
        <div className="checkout-page"><div className="container"><div className="empty-state">
            <div className="empty-state-icon">🛒</div><h3>Cart is empty</h3>
            <button className="btn btn-primary" onClick={() => navigate('/shop')}>Shop Now</button>
        </div></div></div>
    );

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Checkout</h1>
                <form onSubmit={handleSubmit}>
                    <div className="checkout-grid">
                        <div>
                            <div className="checkout-section">
                                <h3 className="checkout-section-title"><FiMapPin /> Shipping Address</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                    <input className="form-input" placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} required />
                                    <input className="form-input" placeholder="Phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
                                </div>
                                <input className="form-input" style={{ marginTop: 'var(--spacing-md)' }} placeholder="Address Line 1" value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} required />
                                <input className="form-input" style={{ marginTop: 'var(--spacing-md)' }} placeholder="Address Line 2" value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                                    <input className="form-input" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                                    <input className="form-input" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                                    <input className="form-input" placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required />
                                </div>
                            </div>

                            <div className="checkout-section">
                                <h3 className="checkout-section-title"><FiCreditCard /> Payment Method</h3>
                                {[{ v: 'razorpay', l: 'Razorpay (Cards, UPI, Wallets)' }, { v: 'cod', l: 'Cash on Delivery' }].map(opt => (
                                    <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: paymentMethod === opt.v ? 'rgba(212,175,55,0.1)' : 'var(--bg-darker)', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: 'var(--spacing-sm)', border: paymentMethod === opt.v ? '1px solid var(--gold-primary)' : '1px solid transparent' }}>
                                        <input type="radio" name="payment" value={opt.v} checked={paymentMethod === opt.v} onChange={(e) => setPaymentMethod(e.target.value)} style={{ display: 'none' }} />
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: paymentMethod === opt.v ? 'var(--gold-primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {paymentMethod === opt.v && <FiCheck size={12} color="var(--gold-primary)" />}
                                        </div>
                                        {opt.l}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="order-summary">
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Summary</h3>
                            {(items || []).map(item => (
                                <div key={item.product?._id} style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)', paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/60'} alt="" style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{item.product?.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</p>
                                    </div>
                                    <p style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                            <div className="summary-item"><span>Subtotal</span><span>{formatPrice(totalAmount)}</span></div>
                            <div className="summary-item"><span>Shipping</span><span>{shippingCharges === 0 ? 'FREE' : formatPrice(shippingCharges)}</span></div>
                            <div className="summary-item"><span>GST (3%)</span><span>{formatPrice(tax)}</span></div>
                            <div className="summary-total"><span>Total</span><span style={{ color: 'var(--gold-primary)' }}>{formatPrice(grandTotal)}</span></div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={isLoading}>
                                {isLoading ? 'Processing...' : (paymentMethod === 'cod' ? 'Place Order' : 'Pay Now')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
