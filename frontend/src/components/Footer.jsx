import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <span style={styles.logoText}>AIZEN NOTES</span>
          <p style={styles.tagline}>Luxury fragrances crafted for the discerning soul.</p>
        </div>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/shop" style={styles.link}>Shop</Link>
          <Link to="/cart" style={styles.link}>Cart</Link>
        </div>
        <p style={styles.copy}>&copy; {new Date().getFullYear()} Aizen Notes. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#1a1208',
    padding: '40px 24px 24px',
    marginTop: 80,
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    textAlign: 'center',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    color: '#d4a72c',
    letterSpacing: '0.2em',
  },
  tagline: {
    color: '#8a7050',
    fontSize: 13,
    fontStyle: 'italic',
  },
  links: {
    display: 'flex',
    gap: 24,
  },
  link: {
    color: '#a08040',
    fontSize: 13,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  copy: {
    color: '#5a4a30',
    fontSize: 12,
  },
};
