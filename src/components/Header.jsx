import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice';

const Header = ({ onCartOpen }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { user } = useSelector(state => state.auth);
    const { items } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsDropdownOpen(false);
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo">
                    <div className="logo-icon">💎</div>
                    <span className="logo-text">SJSilvers</span>
                </Link>

                <nav className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/shop" className="nav-link">Shop</Link>
                    <Link to="/shop?category=gold" className="nav-link">Gold</Link>
                    <Link to="/shop?category=silver" className="nav-link">Silver</Link>
                    <Link to="/shop?featured=true" className="nav-link">Collections</Link>
                </nav>

                <div className="nav-actions">
                    <button
                        className="nav-icon"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        aria-label="Search"
                    >
                        <FiSearch />
                    </button>

                    {user && (
                        <Link to="/dashboard/wishlist" className="nav-icon" aria-label="Wishlist">
                            <FiHeart />
                        </Link>
                    )}

                    <button
                        className="nav-icon"
                        onClick={onCartOpen}
                        aria-label="Cart"
                    >
                        <FiShoppingCart />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>

                    {user ? (
                        <div className="user-dropdown" style={{ position: 'relative' }}>
                            <button
                                className="nav-icon"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <FiUser />
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-menu" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '8px',
                                    background: 'var(--bg-card)',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-lg)',
                                    minWidth: '200px',
                                    padding: 'var(--spacing-sm)',
                                    zIndex: 100
                                }}>
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        marginBottom: 'var(--spacing-sm)'
                                    }}>
                                        <p style={{ fontWeight: 600 }}>{user.name}</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.email}</p>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        className="dropdown-item"
                                        onClick={() => setIsDropdownOpen(false)}
                                        style={{
                                            display: 'block',
                                            padding: 'var(--spacing-sm) var(--spacing-md)',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'var(--text-secondary)'
                                        }}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/dashboard/orders"
                                        className="dropdown-item"
                                        onClick={() => setIsDropdownOpen(false)}
                                        style={{
                                            display: 'block',
                                            padding: 'var(--spacing-sm) var(--spacing-md)',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'var(--text-secondary)'
                                        }}
                                    >
                                        My Orders
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className="dropdown-item"
                                            onClick={() => setIsDropdownOpen(false)}
                                            style={{
                                                display: 'block',
                                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                                borderRadius: 'var(--radius-sm)',
                                                color: 'var(--gold-primary)'
                                            }}
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: 'var(--spacing-sm) var(--spacing-md)',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'var(--accent-error)',
                                            background: 'none',
                                            marginTop: 'var(--spacing-sm)',
                                            borderTop: '1px solid rgba(255,255,255,0.1)',
                                            paddingTop: 'var(--spacing-md)'
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-secondary btn-sm">
                            Login
                        </Link>
                    )}

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Search Overlay */}
            {isSearchOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-card)',
                    padding: 'var(--spacing-lg)',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                    <form onSubmit={handleSearch} className="container">
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', maxWidth: '600px', margin: '0 auto' }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search for jewelry..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="btn btn-primary">Search</button>
                        </div>
                    </form>
                </div>
            )}
        </header>
    );
};

export default Header;
