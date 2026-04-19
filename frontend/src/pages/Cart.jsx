import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptyText}>Discover our luxury fragrances and add some to your cart.</p>
        <Link to="/shop" style={styles.btn}>Browse Collection</Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.title}>Your Cart</h1>
        <div style={styles.layout}>
          <div style={styles.items}>
            {cart.map(item => (
              <div key={item.id} style={styles.item}>
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=120'}
                  alt={item.name}
                  style={styles.img}
                />
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemCategory}>{item.category}</p>
                  <p style={styles.itemPrice}>{parseFloat(item.price).toFixed(2)} PKR</p>
                </div>
                <div style={styles.qty}>
                  <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span style={styles.qtyNum}>{item.quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div style={styles.itemTotal}>
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} PKR
                </div>
                <button style={styles.remove} onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <h2 style={styles.sumTitle}>Order Summary</h2>
            <div style={styles.sumRow}>
              <span>Subtotal</span>
              <span>{totalPrice.toFixed(2)} PKR</span>
            </div>
            <div style={styles.sumRow}>
              <span>Shipping</span>
              <span style={{ color: '#3a7a3a' }}>Free</span>
            </div>
            <div style={styles.divider} />
            <div style={{ ...styles.sumRow, fontWeight: 700, fontSize: 18 }}>
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} PKR</span>
            </div>
            <Link to="/checkout" style={styles.checkoutBtn}>Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '60px 0 80px' },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36,
    color: '#1a1208',
    marginBottom: 40,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: 40,
    alignItems: 'start',
  },
  items: { display: 'flex', flexDirection: 'column', gap: 16 },
  item: {
    background: '#fff',
    borderRadius: 12,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 8,
    objectFit: 'cover',
    flexShrink: 0,
    background: '#f5f0e8',
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 16,
    color: '#1a1208',
    marginBottom: 4,
  },
  itemCategory: { color: '#b8860b', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' },
  itemPrice: { color: '#6b5c3e', fontSize: 14 },
  qty: { display: 'flex', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 28,
    height: 28,
    border: '1px solid #e8e0d0',
    background: '#fff',
    borderRadius: 4,
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNum: { fontSize: 16, fontWeight: 600, minWidth: 24, textAlign: 'center' },
  itemTotal: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#b8860b',
    minWidth: 80,
    textAlign: 'right',
  },
  remove: {
    background: 'none',
    border: 'none',
    color: '#c0a878',
    fontSize: 16,
    cursor: 'pointer',
    padding: 4,
  },
  summary: {
    background: '#fff',
    borderRadius: 12,
    padding: '28px 24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  sumTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    color: '#1a1208',
    marginBottom: 4,
  },
  sumRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 15,
    color: '#2d2416',
  },
  divider: { borderTop: '1px solid #e8e0d0' },
  checkoutBtn: {
    display: 'block',
    textAlign: 'center',
    background: '#1a1208',
    color: '#d4a72c',
    padding: '14px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginTop: 8,
  },
  empty: {
    textAlign: 'center',
    padding: '100px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    color: '#1a1208',
  },
  emptyText: { color: '#6b5c3e', fontSize: 16 },
  btn: {
    marginTop: 8,
    background: '#1a1208',
    color: '#d4a72c',
    padding: '12px 28px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
};
