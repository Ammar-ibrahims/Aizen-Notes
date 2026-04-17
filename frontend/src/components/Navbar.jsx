import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav} className="glass">
      <div style={styles.container} className="nav-container">
        <Link to="/" style={styles.logo}>
          <img src="/logo.png" alt="Aizen Notes" style={styles.logoImg} />
        </Link>

        <div style={styles.links} className="nav-links">
          <Link 
            to="/" 
            style={{
              ...styles.link,
              color: isActive('/') || hoveredLink === 'home' ? 'var(--color-primary)' : 'var(--color-text)',
              textShadow: isActive('/') || hoveredLink === 'home' ? '0 0 15px rgba(255,215,0,0.8)' : 'none',
              transform: hoveredLink === 'home' ? 'translateY(-2px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setHoveredLink('home')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Home
            {isActive('/') && <span style={styles.activeDot} className="active-glow"></span>}
          </Link>
          
          <Link 
            to="/shop" 
            style={{
              ...styles.link,
              color: isActive('/shop') || hoveredLink === 'shop' ? 'var(--color-primary)' : 'var(--color-text)',
              textShadow: isActive('/shop') || hoveredLink === 'shop' ? '0 0 15px rgba(255,215,0,0.8)' : 'none',
              transform: hoveredLink === 'shop' ? 'translateY(-2px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setHoveredLink('shop')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Shop
            {isActive('/shop') && <span style={styles.activeDot} className="active-glow"></span>}
          </Link>

          <Link 
            to="/cart" 
            style={{
              ...styles.link,
              color: isActive('/cart') || hoveredLink === 'cart' ? 'var(--color-primary)' : 'var(--color-text)',
              textShadow: isActive('/cart') || hoveredLink === 'cart' ? '0 0 15px rgba(255,215,0,0.8)' : 'none',
              transform: hoveredLink === 'cart' ? 'translateY(-2px)' : 'translateY(0)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={() => setHoveredLink('cart')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <span>Cart</span>
            {totalItems > 0 && <span style={{...styles.badge, animation: 'pulse 2s infinite'}}>
              {totalItems}
            </span>}
            {isActive('/cart') && <span style={styles.activeDot} className="active-glow"></span>}
          </Link>
        </div>
      </div>
      <style>{`
        .active-glow {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background: var(--color-primary);
          border-radius: 50%;
          box-shadow: 0 0 10px 2px rgba(255,215,0,0.8);
          animation: fade-in-up 0.3s ease-out forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translate(-50%, 4px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(255,215,0,0.4); }
          50% { transform: scale(1.15); box-shadow: 0 0 20px rgba(255,215,0,0.8); }
        }
      `}</style>
    </nav>
  );
}

const styles = {
  nav: {
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    transition: 'var(--transition)',
  },
  container: {
    padding: '20px 24px',
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    transition: 'var(--transition)',
  },
  logoImg: {
    height: 32,
    width: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 4px 10px rgba(255,215,0,0.3))',
    transition: 'var(--transition)',
  },
  links: {},
  link: {
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    transition: 'var(--transition)',
    position: 'relative',
    paddingBottom: 4,
  },
  badge: {
    background: 'linear-gradient(135deg, #ffd700, #b8860b)',
    color: '#050505',
    borderRadius: '50%',
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 900,
    border: '2px solid rgba(0,0,0,0.5)',
    transition: 'var(--transition)',
  },
};
