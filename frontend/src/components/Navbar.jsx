import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText}>AIZEN</span>
          <span style={styles.logoSub}>NOTES</span>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/shop" style={styles.link}>Shop</Link>
          <Link to="/cart" style={styles.cartBtn}>
            <span>Cart</span>
            {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#1a1208',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontWeight: 700,
    color: '#d4a72c',
    letterSpacing: '0.15em',
  },
  logoSub: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 9,
    color: '#a08040',
    letterSpacing: '0.4em',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  link: {
    color: '#e8d8b0',
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    transition: 'color 0.2s',
  },
  cartBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#e8d8b0',
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    background: 'rgba(212,167,44,0.15)',
    border: '1px solid rgba(212,167,44,0.3)',
    borderRadius: 6,
    padding: '6px 14px',
    position: 'relative',
  },
  badge: {
    background: '#d4a72c',
    color: '#1a1208',
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
  },
};
