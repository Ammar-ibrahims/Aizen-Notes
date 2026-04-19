import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Oriental', 'Fresh', 'Woody', 'Musky', 'Floral'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    api.get('/api/products')
      .then(res => {
        setProducts(res.data);
        setFiltered(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filterByCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      setFiltered(products);
    } else {
      setFiltered(products.filter(p => p.category === cat));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.ambientGlow1}></div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={styles.header}>
          <h1 style={styles.title}>Our Perfumes</h1>
          <div style={styles.titleUnderline}></div>
          <p style={styles.sub}>Discover your signature scent in 3D</p>
        </div>

        <div style={styles.filters}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              style={{ ...styles.filterBtn, ...(activeCategory === cat ? styles.filterActive : {}) }}
              onClick={() => filterByCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.loading}>Loading 3D Experience...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.loading}>No products in this category.</div>
        ) : (
          <div className="grid" style={styles.grid}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '80px 0 120px',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlow1: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80vw',
    height: '600px',
    background: 'radial-gradient(circle, rgba(255,215,0,0.03) 0%, transparent 60%)',
    filter: 'blur(80px)',
    zIndex: 0,
  },
  header: {
    textAlign: 'center',
    marginBottom: 60,
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontWeight: 800,
    color: 'var(--color-text)',
    marginBottom: 16,
    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  titleUnderline: {
    width: 80,
    height: 4,
    background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
    margin: '0 auto 24px',
    borderRadius: 2,
  },
  sub: {
    color: 'var(--color-text-muted)',
    fontSize: 18,
    letterSpacing: '0.05em',
  },
  filters: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 60,
  },
  filterBtn: {
    border: '1px solid rgba(255,215,0,0.2)',
    background: 'rgba(255,215,0,0.03)',
    color: 'var(--color-text)',
    padding: '12px 28px',
    borderRadius: 'var(--radius-pill)',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    transition: 'var(--transition)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)',
  },
  filterActive: {
    background: 'linear-gradient(135deg, rgba(255,215,0,0.2), transparent)',
    color: 'var(--color-primary)',
    border: '1px solid rgba(255,215,0,0.4)',
    textShadow: '0 0 10px rgba(255,215,0,0.5)',
    boxShadow: '0 15px 40px rgba(255,215,0,0.15)',
  },
  grid: {
    display: 'grid',
    gap: 40,
    perspective: 1500,
  },
  loading: {
    textAlign: 'center',
    color: 'var(--color-primary)',
    padding: 100,
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '0.1em',
    animation: 'pulse-glow 2s infinite',
  },
};
