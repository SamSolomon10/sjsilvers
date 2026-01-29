import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { updateCartItem, removeFromCart } from '../redux/slices/cartSlice';

const Cart = ({ isOpen, onClose }) => {
    const { items, totalAmount, isLoading } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleUpdateQuantity = (productId, quantity) => {
        dispatch(updateCartItem({ productId, quantity }));
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    return (
        <>
            <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiShoppingBag /> Shopping Cart
                        {items.length > 0 && (
                            <span style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                                fontWeight: 'normal'
                            }}>
                                ({items.length} items)
                            </span>
                        )}
                    </h3>
                    <button
                        className="nav-icon"
                        onClick={onClose}
                        style={{ background: 'var(--bg-darker)', border: 'none' }}
                    >
                        <FiX />
                    </button>
                </div>

                <div className="cart-items">
                    {!user ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🔐</div>
                            <h3>Please Login</h3>
                            <p>Login to view your cart and checkout</p>
                            <Link to="/login" className="btn btn-primary" onClick={onClose}>
                                Login Now
                            </Link>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🛒</div>
                            <h3>Your cart is empty</h3>
                            <p>Start shopping to add items to your cart</p>
                            <Link to="/shop" className="btn btn-primary" onClick={onClose}>
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        (items || []).map((item) => (
                            <div key={item.product?._id || item._id} className="cart-item">
                                <div className="cart-item-image">
                                    <img
                                        src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80'}
                                        alt={item.product?.name || 'Product'}
                                    />
                                </div>
                                <div className="cart-item-details">
                                    <Link
                                        to={`/product/${item.product?._id}`}
                                        className="cart-item-name"
                                        onClick={onClose}
                                    >
                                        {item.product?.name || 'Product'}
                                    </Link>
                                    <div className="cart-item-meta">
                                        {item.product?.metal} • {item.product?.purity} • {item.product?.weight}g
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: '8px'
                                    }}>
                                        <div className="cart-item-quantity">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleUpdateQuantity(item.product?._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <FiMinus size={14} />
                                            </button>
                                            <span style={{
                                                minWidth: '30px',
                                                textAlign: 'center',
                                                fontWeight: 600
                                            }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleUpdateQuantity(item.product?._id, item.quantity + 1)}
                                            >
                                                <FiPlus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleRemove(item.product?._id)}
                                            style={{ color: 'var(--accent-error)' }}
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{
                                    textAlign: 'right',
                                    minWidth: '80px'
                                }}>
                                    <div style={{ fontWeight: 700, color: 'var(--gold-primary)' }}>
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                    {item.quantity > 1 && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {formatPrice(item.price)} each
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {user && items.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total</span>
                            <span style={{ color: 'var(--gold-primary)' }}>{formatPrice(totalAmount)}</span>
                        </div>
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            marginBottom: 'var(--spacing-md)',
                            textAlign: 'center'
                        }}>
                            Taxes and shipping calculated at checkout
                        </p>
                        <Link
                            to="/checkout"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                            onClick={onClose}
                        >
                            Proceed to Checkout
                        </Link>
                        <Link
                            to="/shop"
                            className="btn btn-secondary"
                            style={{ width: '100%', marginTop: '8px' }}
                            onClick={onClose}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
