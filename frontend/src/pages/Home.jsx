import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setFeatured(res.data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroEyebrow}>Luxury Fragrance Collection</p>
          <h1 style={styles.heroTitle}>Wear Your<br />Story</h1>
          <p style={styles.heroSub}>Handcrafted perfumes for those who dare to be remembered.</p>
          <div style={styles.heroBtns}>
            <Link to="/shop" style={styles.btnPrimary}>Explore Collection</Link>
          </div>
        </div>
        <div style={styles.heroDecor}>
          <div style={styles.heroCircle1} />
          <div style={styles.heroCircle2} />
          <img
            src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=500"
            alt="Hero perfume"
            style={styles.heroImg}
          />
        </div>
      </section>

      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Our Collection</h2>
            <p style={styles.sectionSub}>Signature scents for every occasion</p>
          </div>

          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <div style={styles.grid}>
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/shop" style={styles.btnOutline}>View All Perfumes</Link>
          </div>
        </div>
      </section>

      <section style={styles.banner}>
        <div className="container">
          <div style={styles.bannerInner}>
            <div>
              <h2 style={styles.bannerTitle}>The Art of Perfumery</h2>
              <p style={styles.bannerText}>Each fragrance is a journey — a blend of the finest ingredients sourced from around the world, composed by master perfumers.</p>
            </div>
            <Link to="/shop" style={styles.btnGold}>Shop Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a1208 0%, #2d1f0a 50%, #1a1208 100%)',
    minHeight: 560,
    display: 'flex',
    alignItems: 'center',
    padding: '60px 24px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    maxWidth: 520,
    margin: '0 auto 0 auto',
    paddingLeft: 'max(24px, calc((100vw - 1200px) / 2))',
    zIndex: 2,
    position: 'relative',
  },
  heroEyebrow: {
    color: '#d4a72c',
    fontSize: 13,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    marginBottom: 16,
    fontWeight: 500,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 64,
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.1,
    marginBottom: 20,
  },
  heroSub: {
    color: '#c0a878',
    fontSize: 16,
    lineHeight: 1.7,
    marginBottom: 36,
    maxWidth: 380,
  },
  heroBtns: {
    display: 'flex',
    gap: 16,
  },
  btnPrimary: {
    background: '#d4a72c',
    color: '#1a1208',
    padding: '14px 32px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  heroDecor: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minHeight: 380,
  },
  heroCircle1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'rgba(212,167,44,0.08)',
    border: '1px solid rgba(212,167,44,0.15)',
  },
  heroCircle2: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: '50%',
    background: 'rgba(212,167,44,0.12)',
  },
  heroImg: {
    width: 260,
    height: 340,
    objectFit: 'cover',
    borderRadius: 16,
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    position: 'relative',
    zIndex: 2,
  },
  section: {
    padding: '80px 0',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 48,
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36,
    fontWeight: 700,
    color: '#1a1208',
    marginBottom: 8,
  },
  sectionSub: {
    color: '#6b5c3e',
    fontSize: 16,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 28,
  },
  loading: {
    textAlign: 'center',
    color: '#6b5c3e',
    padding: 60,
    fontSize: 16,
  },
  btnOutline: {
    display: 'inline-block',
    border: '2px solid #1a1208',
    color: '#1a1208',
    padding: '12px 32px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  banner: {
    background: '#1a1208',
    padding: '64px 24px',
  },
  bannerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 32,
    flexWrap: 'wrap',
  },
  bannerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    color: '#fff',
    marginBottom: 12,
  },
  bannerText: {
    color: '#a08040',
    fontSize: 15,
    lineHeight: 1.7,
    maxWidth: 560,
  },
  btnGold: {
    background: '#d4a72c',
    color: '#1a1208',
    padding: '14px 32px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
};
