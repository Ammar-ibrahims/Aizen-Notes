import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <footer style={styles.footerWrap}>
      <div style={styles.footer} className="glass">
        <div style={styles.container}>
          <div style={styles.brand}>
            <img src="/logo.png" alt="Aizen Notes" style={styles.logoImg} />
            <p style={styles.tagline}>Luxury fragrances crafted for the discerning soul.</p>
          </div>
          <div style={styles.links}>
            <Link 
              to="/" 
              style={{
                ...styles.link,
                color: hoveredLink === 'home' ? 'var(--color-primary)' : 'var(--color-text)',
                transform: hoveredLink === 'home' ? 'translateY(-2px)' : 'translateY(0)',
                textShadow: hoveredLink === 'home' ? '0 0 10px rgba(255,215,0,0.5)' : 'none',
              }}
              onMouseEnter={() => setHoveredLink('home')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              style={{
                ...styles.link,
                color: hoveredLink === 'shop' ? 'var(--color-primary)' : 'var(--color-text)',
                transform: hoveredLink === 'shop' ? 'translateY(-2px)' : 'translateY(0)',
                textShadow: hoveredLink === 'shop' ? '0 0 10px rgba(255,215,0,0.5)' : 'none',
              }}
              onMouseEnter={() => setHoveredLink('shop')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Shop
            </Link>
            <Link 
              to="/cart" 
              style={{
                ...styles.link,
                color: hoveredLink === 'cart' ? 'var(--color-primary)' : 'var(--color-text)',
                transform: hoveredLink === 'cart' ? 'translateY(-2px)' : 'translateY(0)',
                textShadow: hoveredLink === 'cart' ? '0 0 10px rgba(255,215,0,0.5)' : 'none',
              }}
              onMouseEnter={() => setHoveredLink('cart')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Cart
            </Link>
          </div>
          <p style={styles.copy}>&copy; {new Date().getFullYear()} Aizen Notes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footerWrap: {
    padding: '0 24px 24px',
    marginTop: 100,
    background: 'transparent',
  },
  footer: {
    borderRadius: 'var(--radius-lg)',
    padding: '56px 24px 32px',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
    textAlign: 'center',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  logoImg: {
    height: 56,
    width: 'auto',
    objectFit: 'contain',
    opacity: 0.95,
    filter: 'drop-shadow(0 12px 28px rgba(255,215,0,0.2))',
    transition: 'var(--transition)',
  },
  tagline: {
    color: 'var(--color-text-muted)',
    fontSize: 16,
    fontStyle: 'italic',
    fontFamily: "var(--font-serif)",
    letterSpacing: '0.05em',
  },
  links: {
    display: 'flex',
    gap: 40,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  link: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    transition: 'var(--transition)',
    position: 'relative',
    paddingBottom: 4,
  },
  copy: {
    color: 'var(--color-text-muted)',
    fontSize: 12,
    letterSpacing: '0.08em',
    fontWeight: 600,
    opacity: 0.7,
  },
};
