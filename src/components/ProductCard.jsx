import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiEye, FiStar } from 'react-icons/fi';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const {
        _id,
        name,
        category,
        metal,
        purity,
        weight,
        basePrice,
        makingCharges = 0,
        discount = 0,
        images,
        ratings,
        isFeatured,
        stock
    } = product;

    const originalPrice = basePrice + makingCharges;
    const finalPrice = originalPrice - (basePrice * discount / 100);

    const isInWishlist = user?.wishlist?.some(item =>
        (typeof item === 'string' ? item : item._id) === _id
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        dispatch(addToCart({ productId: _id }));
        toast.success('Added to cart!');
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to add to wishlist');
            return;
        }
        dispatch(toggleWishlist(_id));
        toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    };

    return (
        <Link to={`/product/${_id}`} className="product-card">
            <div className="product-image">
                <img
                    src={images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
                    alt={name}
                    loading="lazy"
                />

                <div className="product-badges">
                    {isFeatured && <span className="product-badge badge-featured">Featured</span>}
                    {discount > 0 && <span className="product-badge badge-discount">{discount}% OFF</span>}
                    {stock === 0 && <span className="product-badge" style={{ background: 'var(--text-muted)' }}>Out of Stock</span>}
                </div>

                <div className="product-actions">
                    <button
                        className="product-action-btn"
                        onClick={handleToggleWishlist}
                        style={{ color: isInWishlist ? 'var(--accent-error)' : 'inherit' }}
                    >
                        <FiHeart fill={isInWishlist ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        className="product-action-btn"
                        onClick={handleAddToCart}
                        disabled={stock === 0}
                    >
                        <FiShoppingCart />
                    </button>
                    <Link to={`/product/${_id}`} className="product-action-btn">
                        <FiEye />
                    </Link>
                </div>
            </div>

            <div className="product-info">
                <span className="product-category">
                    {metal} • {category}
                </span>
                <h3 className="product-name">{name}</h3>

                <div className="product-meta">
                    <span>{purity} • {weight}g</span>
                    {ratings?.average > 0 && (
                        <span className="product-rating">
                            <FiStar fill="currentColor" size={14} />
                            {ratings.average} ({ratings.count})
                        </span>
                    )}
                </div>

                <div className="product-price">
                    <span className="price-current">{formatPrice(finalPrice)}</span>
                    {discount > 0 && (
                        <span className="price-original">{formatPrice(originalPrice)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
