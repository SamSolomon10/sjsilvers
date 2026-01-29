import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiLogOut, FiSettings } from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice';
import { fetchUserOrders } from '../redux/slices/orderSlice';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { orders } = useSelector(state => state.orders);

    useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
    useEffect(() => { if (user) dispatch(fetchUserOrders()); }, [dispatch, user]);

    const handleLogout = () => { dispatch(logout()); navigate('/'); };
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const navItems = [
        { path: '/dashboard', icon: <FiUser />, label: 'Profile', exact: true },
        { path: '/dashboard/orders', icon: <FiPackage />, label: 'My Orders' },
        { path: '/dashboard/wishlist', icon: <FiHeart />, label: 'Wishlist' },
        { path: '/dashboard/addresses', icon: <FiMapPin />, label: 'Addresses' },
    ];

    if (!user) return null;

    const isExactDashboard = location.pathname === '/dashboard';

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-layout">
                    <aside className="dashboard-sidebar">
                        <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-darker)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)' }}>
                            <p style={{ fontWeight: 600, marginBottom: '4px' }}>{user.name}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.email}</p>
                        </div>
                        <nav className="sidebar-nav">
                            {navItems.map(item => (
                                <Link key={item.path} to={item.path} className={`sidebar-link ${item.exact ? (isExactDashboard ? 'active' : '') : isActive(item.path) ? 'active' : ''}`}>
                                    {item.icon} {item.label}
                                </Link>
                            ))}
                            <button onClick={handleLogout} className="sidebar-link" style={{ color: 'var(--accent-error)', marginTop: 'var(--spacing-md)' }}>
                                <FiLogOut /> Logout
                            </button>
                        </nav>
                    </aside>
                    <main className="dashboard-content">
                        {isExactDashboard ? (
                            <div>
                                <h2>Welcome, {user.name}!</h2>
                                <div className="dashboard-cards" style={{ marginTop: 'var(--spacing-xl)' }}>
                                    <div className="stat-card"><div className="stat-card-icon"><FiPackage /></div>
                                        <div className="stat-card-value">{orders.length}</div><div className="stat-card-label">Total Orders</div></div>
                                    <div className="stat-card"><div className="stat-card-icon"><FiHeart /></div>
                                        <div className="stat-card-value">{user.wishlist?.length || 0}</div><div className="stat-card-label">Wishlist Items</div></div>
                                </div>
                                {orders.length > 0 && (
                                    <div style={{ marginTop: 'var(--spacing-xl)' }}>
                                        <h3>Recent Orders</h3>
                                        {(orders || []).slice(0, 3).map(order => (
                                            <Link key={order._id} to={`/dashboard/orders/${order._id}`} style={{ display: 'block', background: 'var(--bg-card)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', marginTop: 'var(--spacing-sm)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Order #{order._id.slice(-8)}</span>
                                                    <span className={`order-status status-${order.orderStatus}`}>{order.orderStatus}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : <Outlet />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
