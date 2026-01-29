import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders, cancelOrder } from '../redux/slices/orderSlice';
import { toast } from 'react-toastify';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector(state => state.orders);

    useEffect(() => { dispatch(fetchUserOrders()); }, [dispatch]);

    const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const handleCancel = async (orderId) => {
        if (window.confirm('Cancel this order?')) {
            try { await dispatch(cancelOrder(orderId)).unwrap(); toast.success('Order cancelled'); }
            catch (err) { toast.error(err); }
        }
    };

    if (isLoading) return <div className="flex-center" style={{ padding: '3rem' }}><div className="loading-spinner"></div></div>;

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>My Orders</h2>
            {orders.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">📦</div><h3>No orders yet</h3>
                    <Link to="/shop" className="btn btn-primary">Start Shopping</Link></div>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                    {(orders || []).map(order => (
                        <div key={order._id} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-lg)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Order #{order._id.slice(-8)}</p>
                                    <p style={{ fontSize: '0.9rem' }}>{formatDate(order.createdAt)}</p>
                                </div>
                                <span className={`order-status status-${order.orderStatus}`}>{order.orderStatus}</span>
                            </div>
                            <div style={{ padding: 'var(--spacing-lg)' }}>
                                {(order.items || []).slice(0, 2).map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                                        <img src={item.image || 'https://via.placeholder.com/50'} alt="" style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                        <div><p style={{ fontSize: '0.9rem' }}>{item.name}</p><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity} × {formatPrice(item.price)}</p></div>
                                    </div>
                                ))}
                                {(order.items?.length || 0) > 2 && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>+{(order.items?.length || 0) - 2} more items</p>}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-lg)', background: 'var(--bg-darker)' }}>
                                <div><span style={{ color: 'var(--text-secondary)' }}>Total: </span><strong style={{ color: 'var(--gold-primary)' }}>{formatPrice(order.totalAmount)}</strong></div>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    {order.orderStatus === 'processing' && <button onClick={() => handleCancel(order._id)} className="btn btn-dark btn-sm">Cancel</button>}
                                    <Link to={`/dashboard/orders/${order._id}`} className="btn btn-secondary btn-sm">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
