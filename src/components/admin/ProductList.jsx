import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlice';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, isLoading, pagination } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                toast.success('Product deleted');
            } catch (error) {
                toast.error(error || 'Delete failed');
            }
        }
    };

    const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

    if (isLoading) return <div className="loading-spinner"></div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                <h2>Manage Products</h2>
                <Link to="/admin/add-product" className="btn btn-primary"><FiPlus /> Add Product</Link>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>
                                    <img
                                        src={product.images?.[0]?.url || 'https://via.placeholder.com/40'}
                                        alt=""
                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                                <td>{formatPrice(product.basePrice)}</td>
                                <td>
                                    <span style={{
                                        color: product.stock > 0 ? 'var(--accent-success)' : 'var(--accent-error)'
                                    }}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Link to={`/admin/edit-product/${product._id}`} className="btn btn-secondary btn-icon btn-sm">
                                            <FiEdit2 />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="btn btn-dark btn-icon btn-sm"
                                            style={{ color: 'var(--accent-error)' }}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
