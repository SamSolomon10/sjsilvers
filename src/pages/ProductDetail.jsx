import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiStar, FiTruck, FiShield, FiRefreshCw, FiMinus, FiPlus } from 'react-icons/fi';
import { fetchProduct, clearCurrentProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentProduct: product, reviews, isLoading } = useSelector(state => state.products);
    const { user } = useSelector(state => state.auth);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        dispatch(fetchProduct(id));
        return () => dispatch(clearCurrentProduct());
    }, [dispatch, id]);

    if (isLoading || !product) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh', paddingTop: 'var(--header-height)' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const {
        _id,
        name,
        description,
        category,
        metal,
        purity,
        weight,
        basePrice,
        makingCharges = 0,
        discount = 0,
        images,
        stock,
        sku,
        gender,
        occasion,
        ratings
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

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        dispatch(addToCart({ productId: _id, quantity }));
        toast.success('Added to cart!');
    };

    const handleToggleWishlist = () => {
        if (!user) {
            toast.error('Please login to add to wishlist');
            return;
        }
        dispatch(toggleWishlist(_id));
        toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    };

    return (
        <div className="product-detail">
            <div className="container">
                {/* Breadcrumb */}
                <nav style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--text-secondary)' }}>
                    <Link to="/" style={{ color: 'inherit' }}>Home</Link>
                    {' / '}
                    <Link to="/shop" style={{ color: 'inherit' }}>Shop</Link>
                    {' / '}
                    <Link to={`/shop?category=${category}`} style={{ color: 'inherit', textTransform: 'capitalize' }}>
                        {category}
                    </Link>
                    {' / '}
                    <span style={{ color: 'var(--text-primary)' }}>{name}</span>
                </nav>

                <div className="product-detail-grid">
                    {/* Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img
                                src={images?.[activeImage]?.url || 'https://via.placeholder.com/600'}
                                alt={name}
                            />
                            {discount > 0 && (
                                <span className="product-badge badge-discount" style={{
                                    position: 'absolute',
                                    top: 'var(--spacing-lg)',
                                    left: 'var(--spacing-lg)'
                                }}>
                                    {discount}% OFF
                                </span>
                            )}
                        </div>
                        {images?.length > 1 && (
                            <div className="thumbnail-images">
                                {(images || []).map((img, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                                        onClick={() => setActiveImage(index)}
                                    >
                                        <img src={img.url} alt={`${name} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="product-detail-info">
                        <span style={{
                            color: 'var(--gold-primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontSize: '0.85rem'
                        }}>
                            {metal} • {category}
                        </span>

                        <h1>{name}</h1>

                        {ratings?.average > 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                <div style={{ display: 'flex', color: 'var(--gold-primary)' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar
                                            key={i}
                                            fill={i < Math.round(ratings.average) ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                                <span>{ratings.average} ({ratings.count} reviews)</span>
                            </div>
                        )}

                        <div className="product-detail-price">
                            {formatPrice(finalPrice)}
                            {discount > 0 && (
                                <span style={{
                                    fontSize: '1.25rem',
                                    color: 'var(--text-muted)',
                                    textDecoration: 'line-through',
                                    marginLeft: 'var(--spacing-md)'
                                }}>
                                    {formatPrice(originalPrice)}
                                </span>
                            )}
                        </div>

                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                            {description}
                        </p>

                        {/* Specifications */}
                        <div className="product-specs">
                            <div className="spec-item">
                                <span className="spec-label">Metal</span>
                                <span className="spec-value" style={{ textTransform: 'capitalize' }}>{metal}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Purity</span>
                                <span className="spec-value">{purity}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Weight</span>
                                <span className="spec-value">{weight} grams</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">SKU</span>
                                <span className="spec-value">{sku}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Gender</span>
                                <span className="spec-value" style={{ textTransform: 'capitalize' }}>{gender}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Stock</span>
                                <span className="spec-value" style={{
                                    color: stock > 0 ? 'var(--accent-success)' : 'var(--accent-error)'
                                }}>
                                    {stock > 0 ? `${stock} available` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        {occasion?.length > 0 && (
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <span style={{ color: 'var(--text-secondary)', marginRight: 'var(--spacing-sm)' }}>
                                    Perfect for:
                                </span>
                                {occasion.map(occ => (
                                    <span
                                        key={occ}
                                        style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            background: 'var(--bg-card)',
                                            borderRadius: 'var(--radius-xl)',
                                            fontSize: '0.85rem',
                                            marginRight: '8px',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {occ}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Quantity & Actions */}
                        {stock > 0 && (
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <span style={{
                                    display: 'block',
                                    marginBottom: 'var(--spacing-sm)',
                                    color: 'var(--text-secondary)'
                                }}>
                                    Quantity
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                    <button
                                        className="btn btn-dark btn-icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <FiMinus />
                                    </button>
                                    <span style={{
                                        minWidth: '50px',
                                        textAlign: 'center',
                                        fontSize: '1.1rem',
                                        fontWeight: 600
                                    }}>
                                        {quantity}
                                    </span>
                                    <button
                                        className="btn btn-dark btn-icon"
                                        onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                        disabled={quantity >= stock}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="product-detail-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleAddToCart}
                                disabled={stock === 0}
                                style={{ flex: 2 }}
                            >
                                <FiShoppingCart />
                                {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button
                                className="btn btn-secondary btn-lg"
                                onClick={handleToggleWishlist}
                                style={{
                                    color: isInWishlist ? 'var(--accent-error)' : 'var(--gold-primary)',
                                    borderColor: isInWishlist ? 'var(--accent-error)' : 'var(--gold-primary)'
                                }}
                            >
                                <FiHeart fill={isInWishlist ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Features */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 'var(--spacing-md)',
                            marginTop: 'var(--spacing-xl)',
                            paddingTop: 'var(--spacing-xl)',
                            borderTop: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <FiShield style={{ fontSize: '1.5rem', color: 'var(--gold-primary)' }} />
                                <p style={{ fontSize: '0.85rem', marginTop: '8px', color: 'var(--text-secondary)' }}>
                                    BIS Hallmarked
                                </p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <FiTruck style={{ fontSize: '1.5rem', color: 'var(--gold-primary)' }} />
                                <p style={{ fontSize: '0.85rem', marginTop: '8px', color: 'var(--text-secondary)' }}>
                                    Free Shipping
                                </p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <FiRefreshCw style={{ fontSize: '1.5rem', color: 'var(--gold-primary)' }} />
                                <p style={{ fontSize: '0.85rem', marginTop: '8px', color: 'var(--text-secondary)' }}>
                                    15-Day Returns
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <section style={{ marginTop: 'var(--spacing-3xl)' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Customer Reviews</h2>
                    {reviews?.length > 0 ? (
                        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                            {(reviews || []).map(review => (
                                <div
                                    key={review._id}
                                    style={{
                                        background: 'var(--bg-card)',
                                        padding: 'var(--spacing-lg)',
                                        borderRadius: 'var(--radius-lg)'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 'var(--spacing-sm)'
                                    }}>
                                        <div>
                                            <strong>{review.user?.name || 'Anonymous'}</strong>
                                            <div style={{ display: 'flex', color: 'var(--gold-primary)', marginTop: '4px' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} />
                                                ))}
                                            </div>
                                        </div>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {review.title && <h4 style={{ marginBottom: '4px' }}>{review.title}</h4>}
                                    <p style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            background: 'var(--bg-card)',
                            padding: 'var(--spacing-2xl)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review!</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProductDetail;
