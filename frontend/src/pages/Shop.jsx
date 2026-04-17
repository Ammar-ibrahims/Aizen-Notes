import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Oriental', 'Fresh', 'Woody', 'Musky', 'Floral'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    axios.get('/api/products')
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
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title}>Our Perfumes</h1>
          <p style={styles.sub}>Discover your signature scent</p>
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
          <div style={styles.loading}>Loading fragrances...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.loading}>No products in this category.</div>
        ) : (
          <div style={styles.grid}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '60px 0 80px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 40,
    fontWeight: 700,
    color: '#1a1208',
    marginBottom: 8,
  },
  sub: {
    color: '#6b5c3e',
    fontSize: 16,
  },
  filters: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 48,
  },
  filterBtn: {
    border: '1px solid #e8e0d0',
    background: '#fff',
    color: '#6b5c3e',
    padding: '8px 20px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    letterSpacing: '0.04em',
    transition: 'all 0.2s',
  },
  filterActive: {
    background: '#1a1208',
    color: '#d4a72c',
    border: '1px solid #1a1208',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 28,
  },
  loading: {
    textAlign: 'center',
    color: '#6b5c3e',
    padding: 80,
    fontSize: 16,
  },
};
