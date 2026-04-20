import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setSelectedImage(res.data.image_url);
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedVariant(res.data.variants[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(product, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!product) return <div style={styles.loading}>Product not found.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.ambientGlow1}></div>
      <div style={styles.ambientGlow2}></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <Link to="/shop" style={styles.back}>← Back to Shop</Link>
        
        <div className="product-layout">
          <div style={styles.imageSection}>
            <div style={styles.imageWrap}>
              <img
                src={selectedImage || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600'}
                alt={product.name}
                style={styles.image}
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div style={styles.thumbnails}>
                {product.images.map((img, i) => (
                  <div 
                    key={i} 
                    style={{
                      ...styles.thumbWrap,
                      borderColor: selectedImage === img ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                      boxShadow: selectedImage === img ? '0 0 15px var(--color-primary)' : 'none'
                    }}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`Thumb ${i}`} style={styles.thumbImg} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="glass" style={styles.info}>
            <span style={styles.category}>{product.category}</span>
            <h1 style={styles.name}>{product.name}</h1>
            <div style={styles.titleUnderline}></div>
            
            <p style={styles.price}>
              {selectedVariant 
                ? parseFloat(selectedVariant.price).toFixed(2) 
                : parseFloat(product.price).toFixed(2)} PKR
            </p>

            {product.variants && product.variants.length > 0 && (
              <div style={styles.variantSection}>
                <p style={styles.variantLabel}>Selected Size:</p>
                <div style={styles.variantGrid}>
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      style={{
                        ...styles.variantBtn,
                        borderColor: selectedVariant?.ml === v.ml ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                        background: selectedVariant?.ml === v.ml ? 'rgba(255,215,0,0.1)' : 'transparent',
                        color: selectedVariant?.ml === v.ml ? 'var(--color-primary)' : '#fff',
                        boxShadow: selectedVariant?.ml === v.ml ? '0 0 15px rgba(255,215,0,0.2)' : 'none',
                      }}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.ml}ml
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p style={styles.desc}>{product.description}</p>
            
            <div style={styles.stock}>
              {product.stock > 0
                ? <span style={styles.inStock}>● {product.stock} in stock - Ready to ship</span>
                : <span style={styles.outOfStock}>● Out of stock</span>}
            </div>
            
            <div style={{ marginTop: 24 }}>
              <button
                className="btn-3d"
                style={{
                  ...styles.addBtn,
                  background: added ? 'linear-gradient(135deg, #3a7a3a, #2a5a2a)' : undefined,
                  boxShadow: added ? '0 0 20px rgba(58,122,58,0.6)' : undefined,
                  color: added ? '#fff' : undefined,
                  borderColor: added ? '#3a7a3a' : undefined,
                  opacity: product.stock === 0 ? 0.5 : 1,
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  transform: added ? 'scale(0.98)' : undefined
                }}
                onClick={handleAdd}
                disabled={product.stock === 0 || added}
              >
                {added ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { 
    padding: '60px 0 100px',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlow1: {
    position: 'absolute',
    top: '0',
    left: '10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 60%)',
    filter: 'blur(80px)',
    zIndex: 0,
  },
  ambientGlow2: {
    position: 'absolute',
    bottom: '-10%',
    right: '10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 60%)',
    filter: 'blur(80px)',
    zIndex: 0,
  },
  loading: { 
    textAlign: 'center', 
    padding: 100, 
    color: 'var(--color-primary)', 
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '0.1em',
    animation: 'pulse-glow 2s infinite',
  },
  back: {
    display: 'inline-block',
    color: 'var(--color-text-muted)',
    fontSize: 14,
    marginBottom: 40,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'var(--transition)',
  },
  imageWrap: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    aspectRatio: '4/5',
    boxShadow: 'var(--shadow-3d-card)',
    border: '1px solid rgba(255,215,0,0.2)',
    animation: 'float-3d 6s ease-in-out infinite',
    transformStyle: 'preserve-3d',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    padding: '48px',
    borderRadius: 'var(--radius-lg)',
  },
  category: {
    fontSize: 12,
    color: 'var(--color-primary)',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    fontWeight: 800,
    marginBottom: 16,
  },
  name: {
    fontFamily: "var(--font-serif)",
    fontSize: 48,
    fontWeight: 800,
    color: 'var(--color-text)',
    lineHeight: 1.1,
    marginBottom: 16,
    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  titleUnderline: {
    width: 60,
    height: 3,
    background: 'linear-gradient(90deg, var(--color-primary), transparent)',
    marginBottom: 24,
    borderRadius: 2,
  },
  price: {
    fontFamily: "var(--font-serif)",
    fontSize: 36,
    fontWeight: 900,
    background: 'linear-gradient(135deg, #ffd700, #aa8800)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 24,
  },
  desc: {
    color: 'var(--color-text-muted)',
    fontSize: 16,
    lineHeight: 1.8,
    marginBottom: 32,
    whiteSpace: 'pre-wrap',
  },
  stock: { 
    padding: '12px 16px',
    background: 'rgba(0,0,0,0.4)',
    borderRadius: 'var(--radius)',
    display: 'inline-block',
    alignSelf: 'flex-start',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  inStock: { color: '#4ade80', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' },
  outOfStock: { color: '#f87171', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' },
  addBtn: {
    padding: '16px 40px',
    fontSize: 14,
    width: '100%',
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  thumbnails: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  thumbWrap: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'var(--transition)',
    background: 'rgba(0,0,0,0.3)',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  variantSection: {
    marginBottom: 32,
  },
  variantLabel: {
    color: 'var(--color-text-muted)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 12,
    fontWeight: 700,
  },
  variantGrid: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  variantBtn: {
    padding: '10px 24px',
    borderRadius: 50,
    border: '2px solid',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontFamily: 'inherit',
  }
};
