import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { optimizeImage } from '../utils/cloudinary';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="glass"
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-20px) rotateX(2deg) rotateY(2deg)' : 'translateY(0) rotateX(0deg) rotateY(0deg)',
        boxShadow: isHovered ? 'var(--shadow-3d-card-hover)' : 'var(--shadow-3d-card)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`}>
        <div style={styles.imageWrap}>
          <img
            src={optimizeImage(product.image_url) || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80'}
            alt={product.name}
            loading="lazy"
            style={{
              ...styles.image,
              transform: isHovered ? 'scale(1.15) rotate(2deg)' : 'scale(1) rotate(0deg)',
            }}
          />
          <div style={styles.overlay}></div>
          <div style={{
            ...styles.category,
            transform: isHovered ? 'translateZ(30px)' : 'translateZ(0)',
          }}>{product.category}</div>
        </div>
      </Link>
      <div style={styles.info}>
        <div style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)', transition: 'var(--transition)' }}>
          <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={styles.name}>{product.name}</h3>
          </Link>
        </div>
        <div style={styles.footer}>
          <span style={{
            ...styles.price,
            transform: isHovered ? 'translateZ(30px) scale(1.1)' : 'translateZ(0) scale(1)',
          }}>{parseFloat(product.price).toFixed(2)} PKR</span>
          <button 
            className="btn-3d"
            style={{
              padding: '10px 20px',
              fontSize: 12,
              background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))',
              transform: isHovered ? 'translateZ(40px) scale(1.05)' : 'translateZ(0) scale(1)',
              boxShadow: isHovered ? 'var(--shadow-3d-btn-hover)' : 'var(--shadow-3d-btn)',
            }} 
            onClick={(e) => {
              e.preventDefault(); // In case card is wrapped in a link later
              addToCart(product);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    transition: 'var(--transition)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 400,
    position: 'relative',
    transformStyle: 'preserve-3d',
    perspective: '1000px',
  },
  imageWrap: {
    position: 'relative',
    height: 280,
    overflow: 'hidden',
    background: 'radial-gradient(circle at center, rgba(255,215,0,0.1), transparent)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)',
    pointerEvents: 'none',
  },
  category: {
    position: 'absolute',
    top: 20,
    left: 20,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(10px)',
    color: 'var(--color-primary)',
    fontSize: 10,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    padding: '8px 16px',
    borderRadius: 'var(--radius-pill)',
    fontWeight: 800,
    border: '1px solid rgba(255,215,0,0.2)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
    transition: 'var(--transition)',
  },
  info: {
    padding: '30px 24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
    transformStyle: 'preserve-3d',
  },
  name: {
    fontFamily: "var(--font-serif)",
    fontSize: 26,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.01em',
    textShadow: '0 4px 12px rgba(0,0,0,0.8)',
    marginBottom: 8,
  },
  desc: {
    color: 'var(--color-text-muted)',
    fontSize: 14,
    lineHeight: 1.6,
    flex: 1,
    fontWeight: 400,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 20,
    borderTop: '1px solid rgba(255,255,255,0.05)',
    transformStyle: 'preserve-3d',
  },
  price: {
    fontFamily: "var(--font-serif)",
    fontSize: 22,
    fontWeight: 900,
    background: 'linear-gradient(135deg, #ffd700, #aa8800)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 4px 12px rgba(0,0,0,0.4)',
    transition: 'var(--transition)',
    transformOrigin: 'left center',
  },
  btn: {
    background: 'linear-gradient(135deg, #ffd700 0%, #aa8800 100%)',
    color: '#050505',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    padding: '12px 24px',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
};
