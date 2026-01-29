import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrash2 } from 'react-icons/fi';
import { toggleWishlist } from '../redux/slices/authSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const wishlist = user?.wishlist || [];

    const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

    const handleRemove = (id) => { dispatch(toggleWishlist(id)); toast.success('Removed from wishlist'); };
    const handleAddToCart = (id) => { dispatch(addToCart({ productId: id })); toast.success('Added to cart!'); };

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>My Wishlist</h2>
            {wishlist.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">❤️</div><h3>Wishlist is empty</h3>
                    <Link to="/shop" className="btn btn-primary">Explore Products</Link></div>
            ) : (
                <div className="products-grid">
                    {(wishlist || []).map(product => {
                        if (typeof product === 'string') return null;
                        const price = (product.basePrice || 0) + (product.makingCharges || 0) - ((product.basePrice || 0) * (product.discount || 0) / 100);
                        return (
                            <div key={product._id} className="product-card">
                                <Link to={`/product/${product._id}`} className="product-image">
                                    <img src={product.images?.[0]?.url || 'https://via.placeholder.com/300'} alt={product.name} />
                                </Link>
                                <div className="product-info">
                                    <span className="product-category">{product.metal} • {product.category}</span>
                                    <h3 className="product-name">{product.name}</h3>
                                    <div className="product-price"><span className="price-current">{formatPrice(price)}</span></div>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                                        <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                                        <button className="btn btn-dark btn-icon btn-sm" onClick={() => handleRemove(product._id)}><FiTrash2 /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
