import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!product) return <div style={styles.loading}>Product not found.</div>;

  return (
    <div style={styles.page}>
      <div className="container">
        <Link to="/shop" style={styles.back}>← Back to Shop</Link>
        <div style={styles.detail}>
          <div style={styles.imageWrap}>
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600'}
              alt={product.name}
              style={styles.image}
            />
          </div>
          <div style={styles.info}>
            <span style={styles.category}>{product.category}</span>
            <h1 style={styles.name}>{product.name}</h1>
            <p style={styles.price}>${parseFloat(product.price).toFixed(2)}</p>
            <p style={styles.desc}>{product.description}</p>
            <div style={styles.stock}>
              {product.stock > 0
                ? <span style={styles.inStock}>{product.stock} in stock</span>
                : <span style={styles.outOfStock}>Out of stock</span>}
            </div>
            <button
              style={{ ...styles.addBtn, ...(added ? styles.addedBtn : {}) }}
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px 0 80px' },
  loading: { textAlign: 'center', padding: 80, color: '#6b5c3e', fontSize: 16 },
  back: {
    display: 'inline-block',
    color: '#6b5c3e',
    fontSize: 14,
    marginBottom: 32,
    fontWeight: 500,
  },
  detail: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 60,
    alignItems: 'start',
  },
  imageWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    background: '#f5f0e8',
    aspectRatio: '4/5',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  category: {
    fontSize: 12,
    color: '#b8860b',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  name: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 40,
    fontWeight: 700,
    color: '#1a1208',
    lineHeight: 1.2,
  },
  price: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28,
    fontWeight: 700,
    color: '#b8860b',
  },
  desc: {
    color: '#6b5c3e',
    fontSize: 15,
    lineHeight: 1.8,
  },
  stock: { marginTop: 4 },
  inStock: { color: '#3a7a3a', fontSize: 13, fontWeight: 600 },
  outOfStock: { color: '#c44', fontSize: 13, fontWeight: 600 },
  addBtn: {
    marginTop: 8,
    background: '#1a1208',
    color: '#d4a72c',
    border: 'none',
    borderRadius: 8,
    padding: '16px 32px',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  addedBtn: {
    background: '#3a7a3a',
    color: '#fff',
  },
};
