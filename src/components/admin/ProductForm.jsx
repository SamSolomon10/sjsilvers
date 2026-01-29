import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, fetchProduct } from '../../redux/slices/productSlice';
import { toast } from 'react-toastify';
import { FiUpload, FiX } from 'react-icons/fi';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct, isLoading } = useSelector(state => state.products);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        metal: '',
        purity: '',
        weight: '',
        basePrice: '',
        makingCharges: '',
        stock: '',
        gender: 'women',
        featured: false,
        images: [''] // Array of URL strings for now
    });

    useEffect(() => {
        if (id) {
            dispatch(fetchProduct(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (id && currentProduct) {
            setFormData({
                name: currentProduct.name || '',
                description: currentProduct.description || '',
                category: currentProduct.category || '',
                metal: currentProduct.metal || '',
                purity: currentProduct.purity || '',
                weight: currentProduct.weight || '',
                basePrice: currentProduct.basePrice || '',
                makingCharges: currentProduct.makingCharges || '',
                stock: currentProduct.stock || '',
                gender: currentProduct.gender || 'women',
                featured: currentProduct.featured || false,
                images: currentProduct.images?.map(img => img.url) || ['']
            });
        }
    }, [currentProduct, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages.length ? newImages : [''] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Format data for API
        const productData = {
            ...formData,
            weight: Number(formData.weight),
            basePrice: Number(formData.basePrice),
            makingCharges: Number(formData.makingCharges),
            stock: Number(formData.stock),
            images: formData.images.filter(url => url.trim()).map(url => ({ url }))
        };

        try {
            if (id) {
                await dispatch(updateProduct({ productId: id, productData })).unwrap();
                toast.success('Product updated successfully');
            } else {
                await dispatch(createProduct(productData)).unwrap();
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error(error || 'Failed to save product');
        }
    };

    if (id && isLoading) return <div className="loading-spinner"></div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>{id ? 'Edit Product' : 'Add New Product'}</h2>

            <form onSubmit={handleSubmit} className="form-layout">
                <div className="form-group">
                    <label>Product Name</label>
                    <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" className="form-input" rows="4" value={formData.description} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="necklaces">Necklaces</option>
                            <option value="rings">Rings</option>
                            <option value="earrings">Earrings</option>
                            <option value="bracelets">Bracelets</option>
                            <option value="bangles">Bangles</option>
                            <option value="chains">Chains</option>
                            <option value="pendants">Pendants</option>
                            <option value="anklets">Anklets</option>
                            <option value="coins">Coins</option>
                            <option value="sets">Sets</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" className="form-select" value={formData.gender} onChange={handleChange} required>
                            <option value="women">Women</option>
                            <option value="men">Men</option>
                            <option value="unisex">Unisex</option>
                            <option value="kids">Kids</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Metal Type</label>
                        <select name="metal" className="form-select" value={formData.metal} onChange={handleChange} required>
                            <option value="">Select Metal</option>
                            <option value="gold">Gold</option>
                            <option value="silver">Silver</option>
                            <option value="platinum">Platinum</option>
                            <option value="rose-gold">Rose Gold</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Purity</label>
                        <select name="purity" className="form-select" value={formData.purity} onChange={handleChange} required>
                            <option value="">Select Purity</option>
                            <option value="24K">24K</option>
                            <option value="22K">22K</option>
                            <option value="18K">18K</option>
                            <option value="14K">14K</option>
                            <option value="999">Silver 999</option>
                            <option value="925">Silver 925</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Weight (g)</label>
                        <input type="number" name="weight" className="form-input" step="0.01" value={formData.weight} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Stock</label>
                        <input type="number" name="stock" className="form-input" value={formData.stock} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Base Price (₹)</label>
                        <input type="number" name="basePrice" className="form-input" value={formData.basePrice} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Making Charges (₹)</label>
                        <input type="number" name="makingCharges" className="form-input" value={formData.makingCharges} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Images (URLs)</label>
                    {formData.images.map((url, index) => (
                        <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                                type="url"
                                className="form-input"
                                placeholder="Image URL (e.g., https://...)"
                                value={url}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                required={index === 0}
                            />
                            {formData.images.length > 1 && (
                                <button type="button" className="btn btn-dark btn-icon" onClick={() => removeImageField(index)}>
                                    <FiX />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addImageField}>
                        <FiUpload /> Add Another Image URL
                    </button>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        style={{ width: 'auto' }}
                    />
                    <label htmlFor="featured" style={{ marginBottom: 0 }}>Featured Product</label>
                </div>

                <div className="form-actions" style={{ marginTop: '2rem' }}>
                    <button type="button" className="btn btn-dark" onClick={() => navigate('/admin/products')}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                        {id ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
