import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', city: '', state: '', address: '', phone_number: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (cart.length === 0 && !success) {
    return (
      <div style={styles.empty}>
        <h2 style={styles.emptyTitle}>Nothing to checkout</h2>
        <Link to="/shop" style={styles.btn}>Shop Now</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.empty}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.successTitle}>Order Placed!</h2>
        <p style={styles.successText}>Thank you for your order. We'll send a confirmation to your email.</p>
        <Link to="/shop" style={styles.btn}>Continue Shopping</Link>
      </div>
    );
  }

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 4) val = `${val.slice(0, 4)}-${val.slice(4)}`;
    setForm({ ...form, phone_number: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.city || !form.state || !form.address || !form.phone_number) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.phone_number.length !== 12) {
      setError('Please enter a valid 11-digit phone number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/orders', {
        customer_name: form.name,
        customer_email: form.email,
        city: form.city,
        state: form.state,
        address: form.address,
        phone_number: form.phone_number,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          variant_ml: item.variant_ml
        })),
      });
      clearCart();
      setSuccess(true);
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.title}>Checkout</h1>
        <div className="checkout-layout">
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.formTitle}>Your Details</h2>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>
              <input required style={styles.input} type="tel" placeholder="0300-0000000" value={form.phone_number} onChange={handlePhoneChange} />
            </div>
            <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={styles.field}>
                <label style={styles.label}>City</label>
                <input required style={styles.input} placeholder="Lahore" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>State / Province</label>
                <input required style={styles.input} placeholder="Punjab" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Delivery Address</label>
              <textarea required style={{...styles.input, minHeight: '80px', resize: 'vertical'}} placeholder="Street address, apartment, suite, etc." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Placing Order...' : `Place Order — ${totalPrice.toFixed(2)} PKR`}
            </button>
          </form>

          <div style={styles.orderSummary}>
            <h2 style={styles.formTitle}>Order Summary</h2>
            {cart.map(item => (
              <div key={item.cartKey} style={styles.orderItem}>
                <span>{item.name} {item.variant_ml ? `(${item.variant_ml}ml)` : ''} × {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} PKR</span>
              </div>
            ))}
            <div style={styles.divider} />
            <div style={{ ...styles.orderItem, fontWeight: 700, fontSize: 16 }}>
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} PKR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '60px 0 80px' },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: 36,
    color: 'var(--color-text)',
    marginBottom: 40,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 40,
    alignItems: 'start',
  },
  form: {
    background: '#fff',
    borderRadius: 12,
    padding: '32px 28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  formTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: 22,
    color: 'var(--color-text)',
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#2d2416', letterSpacing: '0.04em' },
  input: {
    border: '1px solid #e8e0d0',
    borderRadius: 8,
    padding: '12px 14px',
    fontSize: 15,
    color: '#1a1208',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  error: { color: '#c44', fontSize: 14 },
  submitBtn: {
    background: '#1a1208',
    color: '#d4a72c',
    border: 'none',
    borderRadius: 8,
    padding: '16px',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    marginTop: 4,
  },
  orderSummary: {
    background: '#fff',
    borderRadius: 12,
    padding: '28px 24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 15,
    color: '#2d2416',
  },
  divider: { borderTop: '1px solid #e8e0d0' },
  empty: {
    textAlign: 'center',
    padding: '100px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  emptyTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: 32,
    color: 'var(--color-text)',
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: '#3a7a3a',
    color: '#fff',
    fontSize: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36,
    color: '#1a1208',
  },
  successText: { color: '#6b5c3e', fontSize: 16, maxWidth: 400 },
  btn: {
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
