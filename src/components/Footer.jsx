import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="logo">
                            <div className="logo-icon">💎</div>
                            <span className="logo-text">SJSilvers</span>
                        </Link>
                        <p>
                            Premium gold and silver jewelry crafted with precision and passion.
                            Trusted by thousands of customers across India.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-icon" aria-label="Facebook"><FiFacebook /></a>
                            <a href="#" className="social-icon" aria-label="Instagram"><FiInstagram /></a>
                            <a href="#" className="social-icon" aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" className="social-icon" aria-label="YouTube"><FiYoutube /></a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-title">Quick Links</h4>
                        <nav className="footer-links">
                            <Link to="/shop" className="footer-link">All Products</Link>
                            <Link to="/shop?metal=gold" className="footer-link">Gold Jewelry</Link>
                            <Link to="/shop?metal=silver" className="footer-link">Silver Jewelry</Link>
                            <Link to="/shop?category=coins" className="footer-link">Coins & Bars</Link>
                            <Link to="/shop?featured=true" className="footer-link">New Arrivals</Link>
                        </nav>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-title">Customer Care</h4>
                        <nav className="footer-links">
                            <Link to="/about" className="footer-link">About Us</Link>
                            <Link to="/contact" className="footer-link">Contact Us</Link>
                            <Link to="/faq" className="footer-link">FAQs</Link>
                            <Link to="/shipping" className="footer-link">Shipping Info</Link>
                            <Link to="/returns" className="footer-link">Returns & Refunds</Link>
                        </nav>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-title">Contact Us</h4>
                        <div className="footer-links">
                            <div className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiMapPin style={{ color: 'var(--gold-primary)' }} />
                                <span>123 Jewelry Lane, Mumbai, India</span>
                            </div>
                            <div className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiPhone style={{ color: 'var(--gold-primary)' }} />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiMail style={{ color: 'var(--gold-primary)' }} />
                                <span>support@sjsilvers.com</span>
                            </div>
                        </div>
                        <div style={{ marginTop: 'var(--spacing-lg)' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                Subscribe to our newsletter
                            </p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="Your email"
                                    style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                                />
                                <button className="btn btn-primary btn-sm">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 SJSilvers. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                        <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                        <Link to="/terms" className="footer-link">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
