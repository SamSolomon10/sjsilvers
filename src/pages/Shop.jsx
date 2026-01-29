import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { fetchProducts, setFilters, clearFilters, setPage } from '../redux/slices/productSlice';

const Shop = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, filters, pagination = { page: 1, total: 0, pages: 0 }, isLoading } = useSelector(state => state.products);

    useEffect(() => {
        // Apply URL params to filters
        const urlFilters = {};
        ['category', 'metal', 'purity', 'gender', 'sort', 'search', 'featured'].forEach(key => {
            const value = searchParams.get(key);
            if (value) urlFilters[key] = value;
        });

        if (Object.keys(urlFilters).length > 0) {
            dispatch(setFilters(urlFilters));
        }
    }, [dispatch, searchParams]);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch, filters, pagination?.page]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        dispatch(setFilters({ [key]: value }));

        // Update URL
        if (value) {
            searchParams.set(key, value);
        } else {
            searchParams.delete(key);
        }
        setSearchParams(searchParams);
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setSearchParams({});
    };

    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'necklaces', label: 'Necklaces' },
        { value: 'rings', label: 'Rings' },
        { value: 'earrings', label: 'Earrings' },
        { value: 'bracelets', label: 'Bracelets' },
        { value: 'bangles', label: 'Bangles' },
        { value: 'chains', label: 'Chains' },
        { value: 'pendants', label: 'Pendants' },
        { value: 'anklets', label: 'Anklets' },
        { value: 'coins', label: 'Coins' },
        { value: 'sets', label: 'Complete Sets' },
    ];

    const metals = [
        { value: '', label: 'All Metals' },
        { value: 'gold', label: 'Gold' },
        { value: 'silver', label: 'Silver' },
        { value: 'platinum', label: 'Platinum' },
        { value: 'rose-gold', label: 'Rose Gold' },
    ];

    const purities = [
        { value: '', label: 'All Purities' },
        { value: '24K', label: '24K (99.9%)' },
        { value: '22K', label: '22K (91.6%)' },
        { value: '18K', label: '18K (75%)' },
        { value: '14K', label: '14K (58.5%)' },
        { value: '999', label: 'Silver 999' },
        { value: '925', label: 'Silver 925' },
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Top Rated' },
    ];

    const hasActiveFilters = Object.values(filters).some(v => v && v !== 'newest');

    return (
        <div style={{ paddingTop: 'var(--header-height)' }}>
            <div className="container">
                {/* Page Header */}
                <div style={{
                    padding: 'var(--spacing-2xl) 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>
                        {filters.search ? `Search: "${filters.search}"` :
                            filters.category ? categories.find(c => c.value === filters.category)?.label :
                                filters.metal ? `${metals.find(m => m.value === filters.metal)?.label} Collection` :
                                    'All Products'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Showing {products?.length || 0} of {pagination?.total || 0} products
                    </p>
                </div>

                <div className="shop-layout">
                    {/* Filters Sidebar */}
                    <aside className="filters-sidebar">
                        <div className="filter-section">
                            <div className="filter-title">
                                <span><FiFilter /> Filters</span>
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        style={{
                                            background: 'none',
                                            color: 'var(--accent-error)',
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <FiX /> Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="filter-section">
                            <h4 className="filter-title">Category</h4>
                            <select
                                className="form-input form-select"
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-section">
                            <h4 className="filter-title">Metal Type</h4>
                            <div className="filter-options">
                                {metals.map(metal => (
                                    <label
                                        key={metal.value}
                                        className={`filter-option ${filters.metal === metal.value ? 'active' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="metal"
                                            value={metal.value}
                                            checked={filters.metal === metal.value}
                                            onChange={(e) => handleFilterChange('metal', e.target.value)}
                                            style={{ display: 'none' }}
                                        />
                                        <span className="filter-checkbox">
                                            {filters.metal === metal.value && '✓'}
                                        </span>
                                        {metal.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <h4 className="filter-title">Purity</h4>
                            <select
                                className="form-input form-select"
                                value={filters.purity}
                                onChange={(e) => handleFilterChange('purity', e.target.value)}
                            >
                                {purities.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-section">
                            <h4 className="filter-title">Price Range</h4>
                            <div className="price-range">
                                <input
                                    type="number"
                                    className="price-input"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    className="price-input"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-section">
                            <h4 className="filter-title">Gender</h4>
                            <div className="filter-options">
                                {[
                                    { value: '', label: 'All' },
                                    { value: 'women', label: 'Women' },
                                    { value: 'men', label: 'Men' },
                                    { value: 'unisex', label: 'Unisex' },
                                ].map(opt => (
                                    <label
                                        key={opt.value}
                                        className={`filter-option ${filters.gender === opt.value ? 'active' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={opt.value}
                                            checked={filters.gender === opt.value}
                                            onChange={(e) => handleFilterChange('gender', e.target.value)}
                                            style={{ display: 'none' }}
                                        />
                                        <span className="filter-checkbox">
                                            {filters.gender === opt.value && '✓'}
                                        </span>
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main>
                        {/* Sort Bar */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-xl)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
                                <select
                                    className="form-input form-select"
                                    style={{ width: 'auto', padding: '8px 32px 8px 12px' }}
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                >
                                    {sortOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex-center" style={{ padding: 'var(--spacing-3xl)' }}>
                                <div className="loading-spinner"></div>
                            </div>
                        ) : (products?.length || 0) === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🔍</div>
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search terms</p>
                                <button className="btn btn-primary" onClick={handleClearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="products-grid">
                                    {(products || []).map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 'var(--spacing-sm)',
                                        marginTop: 'var(--spacing-2xl)'
                                    }}>
                                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                className={`btn ${page === pagination.page ? 'btn-primary' : 'btn-dark'}`}
                                                onClick={() => dispatch(setPage(page))}
                                                style={{ minWidth: '44px' }}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
