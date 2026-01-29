import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiGrid, FiPackage, FiUsers, FiPlusCircle, FiTrendingUp } from 'react-icons/fi';
import { fetchAdminOrders } from '../../redux/slices/orderSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { adminOrders } = useSelector(state => state.orders);
    const { products } = useSelector(state => state.products);
    const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });

    useEffect(() => { if (!user || user.role !== 'admin') navigate('/'); }, [user, navigate]);
    useEffect(() => {
        dispatch(fetchAdminOrders({}));
        dispatch(fetchProducts());
        axios.get(`${API_URL}/admin/stats`).then(res => setStats(res.data.stats)).catch(() => { });
    }, [dispatch]);

    const isActive = (path) => location.pathname === path;
    const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
    const isExact = location.pathname === '/admin';

    const navItems = [
        { path: '/admin', icon: <FiGrid />, label: 'Overview', exact: true },
        { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
        { path: '/admin/orders', icon: <FiTrendingUp />, label: 'Orders' },
        { path: '/admin/add-product', icon: <FiPlusCircle />, label: 'Add Product' },
    ];

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-layout">
                    <aside className="dashboard-sidebar">
                        <div style={{ padding: 'var(--spacing-md)', background: 'rgba(212,175,55,0.1)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)', border: '1px solid var(--gold-primary)' }}>
                            <p style={{ fontWeight: 600, color: 'var(--gold-primary)' }}>Admin Panel</p>
                        </div>
                        <nav className="sidebar-nav">
                            {navItems.map(item => (
                                <Link key={item.path} to={item.path} className={`sidebar-link ${item.exact ? (isExact ? 'active' : '') : isActive(item.path) ? 'active' : ''}`}>
                                    {item.icon} {item.label}
                                </Link>
                            ))}
                        </nav>
                    </aside>
                    <main className="dashboard-content">
                        {isExact ? (
                            <div>
                                <h2>Admin Dashboard</h2>
                                <div className="dashboard-cards" style={{ marginTop: 'var(--spacing-xl)' }}>
                                    {[
                                        { icon: <FiUsers />, value: stats.totalUsers, label: 'Total Users' },
                                        { icon: <FiPackage />, value: stats.totalProducts || products.length, label: 'Products' },
                                        { icon: <FiTrendingUp />, value: stats.totalOrders || adminOrders.length, label: 'Orders' },
                                        { icon: <FiGrid />, value: formatPrice(stats.totalRevenue || 0), label: 'Revenue' },
                                    ].map((s, i) => (
                                        <div key={i} className="stat-card"><div className="stat-card-icon">{s.icon}</div>
                                            <div className="stat-card-value">{s.value}</div><div className="stat-card-label">{s.label}</div></div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 'var(--spacing-xl)' }}>
                                    <h3>Recent Orders</h3>
                                    <table className="data-table" style={{ marginTop: 'var(--spacing-md)' }}>
                                        <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {(adminOrders || []).slice(0, 5).map(order => (
                                                <tr key={order._id}>
                                                    <td>#{order._id.slice(-8)}</td><td>{order.user?.name || 'N/A'}</td>
                                                    <td>{formatPrice(order.totalAmount)}</td>
                                                    <td><span className={`order-status status-${order.orderStatus}`}>{order.orderStatus}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : <Outlet />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
