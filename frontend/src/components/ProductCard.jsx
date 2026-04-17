import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div style={styles.card}>
      <Link to={`/product/${product.id}`}>
        <div style={styles.imageWrap}>
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400'}
            alt={product.name}
            style={styles.image}
          />
          <div style={styles.category}>{product.category}</div>
        </div>
      </Link>
      <div style={styles.info}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={styles.name}>{product.name}</h3>
        </Link>
        <p style={styles.desc}>{product.description?.substring(0, 80)}...</p>
        <div style={styles.footer}>
          <span style={styles.price}>${parseFloat(product.price).toFixed(2)}</span>
          <button style={styles.btn} onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrap: {
    position: 'relative',
    height: 220,
    overflow: 'hidden',
    background: '#f5f0e8',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  category: {
    position: 'absolute',
    top: 12,
    left: 12,
    background: 'rgba(26, 18, 8, 0.75)',
    color: '#d4a72c',
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: 4,
    fontWeight: 600,
  },
  info: {
    padding: '16px 18px 20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  name: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 18,
    fontWeight: 600,
    color: '#1a1208',
  },
  desc: {
    color: '#6b5c3e',
    fontSize: 13,
    lineHeight: 1.5,
    flex: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#b8860b',
  },
  btn: {
    background: '#1a1208',
    color: '#d4a72c',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};
