import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useIdleTimeout } from '../hooks/useIdleTimeout';

export default function AdminProducts() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    images: [],
    stock: '',
    variants: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);



  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Token present:', !!token, '| Token value:', token);
      const response = await api.delete(`/api/products/${id}`);
      console.log('Delete response:', response.data);
      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      const statusCode = err.response?.status || 'No Status';
      console.error('Delete error:', err.response);
      alert(`Failed to delete product.\nStatus: ${statusCode}\nError: ${errorMsg}`);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        image_url: product.image_url || '',
        images: product.images || [],
        stock: product.stock || '',
        variants: product.variants || []
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', image_url: '', images: [], stock: '', variants: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    const CLOUD_NAME = "diuoiyp4f";
    
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "aizen notes product");
        data.append("cloud_name", CLOUD_NAME);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: data,
        });
        const cloudData = await res.json();
        
        if (!res.ok) throw new Error(cloudData.error?.message || "Cloudinary upload failed");
        uploadedUrls.push(cloudData.secure_url);
      }
      
      setFormData(prev => {
        const newImages = [...prev.images, ...uploadedUrls];
        return { 
          ...prev, 
          images: newImages, 
          image_url: newImages[0] // Set first as main
        };
      });
    } catch (err) {
      alert(`Error uploading image: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { 
        ...prev, 
        images: newImages, 
        image_url: newImages[0] || '' 
      };
    });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ml: '', price: '' }]
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await api.put(`/api/products/${editingProduct.id}`, formData);
        setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
      } else {
        const res = await api.post('/api/products', formData);
        setProducts([res.data, ...products]);
      }
      closeModal();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return (
    <div style={styles.page}>
      <div className="container">
        <div style={styles.header}>
          <div>
            <Link to="/admin" style={styles.backLink}>← Back to Dashboard</Link>
            <h1 style={styles.title}>Manage Products</h1>
          </div>
          <button className="btn-3d" onClick={() => openModal()} style={styles.addBtn}>
            + Add New Product
          </button>
        </div>

        {loading ? (
          <p style={{textAlign: 'center', color: '#fff'}}>Loading inventory...</p>
        ) : error ? (
          <p style={{color: 'red'}}>{error}</p>
        ) : (
          <div className="glass" style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.productNameCell}>
                        <img src={product.image_url} alt={product.name} style={styles.thumbnail} />
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td style={styles.td}>{product.category}</td>
                    <td style={styles.td}>{Number(product.price).toFixed(2)} PKR</td>
                    <td style={styles.td}>
                       <span style={{ color: product.stock > 10 ? '#4caf50' : '#ff9800' }}>
                         {product.stock}
                       </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        <button onClick={() => openModal(product)} style={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDelete(product.id)} style={styles.deleteBtn}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div className="glass" style={styles.modalContent}>
            <h2 style={{fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: 24}}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.grid2}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <input required name="category" value={formData.category} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Price (PKR)</label>
                  <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Stock Quantity</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleChange} style={styles.input} />
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Product Images (First will be main)</label>
                <div style={{display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12}}>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{color: '#fff', fontSize: 14}} />
                  {uploadingImage && <span style={{color: 'var(--color-primary)', fontSize: 13, fontWeight: 700, animation: 'pulse 1.5s infinite'}}>☁️ Uploading to Base...</span>}
                </div>
                
                <div style={styles.imageGallery}>
                  {formData.images.map((url, idx) => (
                    <div key={idx} style={styles.imagePreview}>
                      <img src={url} alt={`Preview ${idx}`} style={styles.previewImg} />
                      <button type="button" onClick={() => removeImage(idx)} style={styles.removeImageBtn}>✕</button>
                      {idx === 0 && <span style={styles.mainBadge}>Main</span>}
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} style={{...styles.input, minHeight: 100}} />
              </div>

              {/* Size Variants Section */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Size Variants (optional)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {formData.variants.map((v, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input
                        type="number"
                        placeholder="ML (e.g. 50)"
                        value={v.ml}
                        onChange={e => updateVariant(idx, 'ml', e.target.value)}
                        style={{ ...styles.input, flex: 1 }}
                      />
                      <input
                        type="number"
                        placeholder="Price (PKR)"
                        value={v.price}
                        onChange={e => updateVariant(idx, 'price', e.target.value)}
                        style={{ ...styles.input, flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        style={{ background: 'rgba(255,50,50,0.2)', color: '#ff6b6b', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 8, padding: '10px 14px', cursor: 'pointer', fontWeight: 800 }}
                      >✕</button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVariant}
                    style={{ background: 'rgba(255,215,0,0.1)', color: 'var(--color-primary)', border: '1px dashed rgba(255,215,0,0.4)', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
                  >+ Add Size Variant</button>
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={closeModal} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" className="btn-3d" style={styles.saveBtn} disabled={uploadingImage}>
                  {editingProduct ? 'Update Inventory' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '80vh', padding: '60px 0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 },
  backLink: { color: 'var(--color-primary)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, display: 'inline-block' },
  title: { fontFamily: 'var(--font-serif)', color: '#fff', fontSize: 36 },
  addBtn: { padding: '12px 24px', fontSize: 13 },
  tableCard: { padding: '24px', borderRadius: '16px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', color: '#fff' },
  th: { textAlign: 'left', padding: '16px', borderBottom: '1px solid rgba(255,215,0,0.2)', color: 'var(--color-primary)', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.1em' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' },
  td: { padding: '16px', verticalAlign: 'middle' },
  productNameCell: { display: 'flex', alignItems: 'center', gap: 16 },
  thumbnail: { width: 48, height: 48, objectFit: 'cover', borderRadius: '8px' },
  actionBtns: { display: 'flex', gap: 12 },
  editBtn: { background: 'rgba(255,215,0,0.1)', color: 'var(--color-primary)', border: '1px solid rgba(255,215,0,0.3)', padding: '6px 16px', borderRadius: '4px', fontSize: 12, textTransform: 'uppercase', cursor: 'pointer' },
  deleteBtn: { background: 'rgba(255,50,50,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,50,50,0.3)', padding: '6px 16px', borderRadius: '4px', fontSize: 12, textTransform: 'uppercase', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalContent: { width: '100%', maxWidth: 700, padding: 40, borderRadius: 16, maxHeight: '90vh', overflowY: 'auto' },
  grid2: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 24 },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { color: 'var(--color-text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' },
  input: { background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,215,0,0.2)', padding: 12, borderRadius: 8, color: '#fff', fontFamily: 'inherit' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 16 },
  cancelBtn: { background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 50, cursor: 'pointer' },
  saveBtn: { padding: '12px 32px' },
  imageGallery: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    background: 'rgba(0,0,0,0.3)',
    padding: '12px',
    borderRadius: '8px',
    minHeight: '60px',
  },
  imagePreview: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  removeImageBtn: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#ff4d4d',
    color: '#fff',
    border: 'none',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    fontSize: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  mainBadge: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'var(--color-primary)',
    color: '#000',
    fontSize: '9px',
    fontWeight: 800,
    textAlign: 'center',
    textTransform: 'uppercase',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
  }
};
