import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import PriceTicker from '../components/PriceTicker';
import { fetchFeaturedProducts } from '../redux/slices/productSlice';

const Home = () => {
    const dispatch = useDispatch();
    const { featuredProducts, isLoading } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchFeaturedProducts());
    }, [dispatch]);

    const categories = [
        { name: 'Necklaces', count: 45, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', slug: 'necklaces' },
        { name: 'Rings', count: 38, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', slug: 'rings' },
        { name: 'Earrings', count: 52, image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400', slug: 'earrings' },
        { name: 'Bangles', count: 28, image: 'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=400', slug: 'bangles' },
        { name: 'Chains', count: 33, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', slug: 'chains' },
        { name: 'Coins', count: 25, image: 'https://images.unsplash.com/photo-1624365168968-f283d506c6b6?w=400', slug: 'coins' },
    ];

    const features = [
        { icon: <FiShield />, title: 'BIS Hallmarked', desc: '100% certified purity guarantee' },
        { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders above ₹50,000' },
        { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '15-day hassle-free returns' },
        { icon: <FiStar />, title: 'Premium Quality', desc: 'Handcrafted by expert artisans' },
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-badge">✨ Premium Collection 2026</span>
                    <h1>
                        Exquisite <span>Gold & Silver</span> Jewelry
                    </h1>
                    <p className="hero-text">
                        Discover our stunning collection of handcrafted jewelry.
                        From timeless classics to modern designs, find the perfect piece for every occasion.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/shop" className="btn btn-primary btn-lg">
                            Shop Now <FiArrowRight />
                        </Link>
                        <Link to="/shop?featured=true" className="btn btn-secondary btn-lg">
                            View Collections
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-value">10K+</div>
                            <div className="hero-stat-label">Happy Customers</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">500+</div>
                            <div className="hero-stat-label">Designs</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">15+</div>
                            <div className="hero-stat-label">Years Legacy</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Price Ticker */}
            <PriceTicker />

            {/* Features */}
            <section style={{ padding: 'var(--spacing-2xl) 0', background: 'var(--bg-darker)' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: 'var(--spacing-xl)'
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                padding: 'var(--spacing-lg)',
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-lg)'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--gold-primary)',
                                    fontSize: '1.5rem'
                                }}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{feature.title}</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-title">
                        <h2>Shop by Category</h2>
                        <p>Explore our carefully curated collections</p>
                    </div>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                to={`/shop?category=${category.slug}`}
                                className="category-card"
                            >
                                <img src={category.image} alt={category.name} />
                                <div className="category-info">
                                    <h3 className="category-name">{category.name}</h3>
                                    <p className="category-count">{category.count} Products</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="products-section">
                <div className="container">
                    <div className="section-title">
                        <h2>Featured Collection</h2>
                        <p>Handpicked selections of our finest pieces</p>
                    </div>
                    {isLoading ? (
                        <div className="flex-center" style={{ padding: 'var(--spacing-3xl)' }}>
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {(featuredProducts || []).slice(0, 8).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                    <div style={{ textAlign: 'center', marginTop: 'var(--spacing-2xl)' }}>
                        <Link to="/shop" className="btn btn-secondary btn-lg">
                            View All Products <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Metal Types */}
            <section style={{ padding: 'var(--spacing-3xl) 0' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 'var(--spacing-xl)'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #1a1510 0%, #0d0d0d 100%)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--spacing-2xl)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🥇</div>
                            <h3 style={{ color: 'var(--gold-primary)' }}>Gold Collection</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                                22K & 24K pure gold jewelry with BIS hallmark certification
                            </p>
                            <Link to="/shop?metal=gold" className="btn btn-primary">
                                Explore Gold
                            </Link>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--spacing-2xl)',
                            border: '1px solid rgba(192, 192, 192, 0.3)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🥈</div>
                            <h3 style={{ color: 'var(--silver-primary)' }}>Silver Collection</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                                925 sterling silver and 999 pure silver artisan pieces
                            </p>
                            <Link to="/shop?metal=silver" className="btn btn-secondary" style={{
                                borderColor: 'var(--silver-primary)',
                                color: 'var(--silver-primary)'
                            }}>
                                Explore Silver
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Banner */}
            <section style={{
                padding: 'var(--spacing-3xl) 0',
                background: 'var(--bg-card)',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>
                        Trusted by <span className="text-gold">10,000+</span> Customers
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto var(--spacing-xl)'
                    }}>
                        Join thousands of satisfied customers who trust SJSilvers for their precious jewelry needs.
                        Every piece is crafted with love and certified for authenticity.
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--spacing-2xl)',
                        flexWrap: 'wrap'
                    }}>
                        <div>
                            <div style={{ fontSize: '2rem', color: 'var(--gold-primary)' }}>⭐ 4.9</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Average Rating</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', color: 'var(--gold-primary)' }}>🏆 50+</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Awards Won</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', color: 'var(--gold-primary)' }}>✓ 100%</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Certified Pure</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
