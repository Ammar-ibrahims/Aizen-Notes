import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, useParams } from 'react-router-dom';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/detail/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      setError('Order not found or database fetch failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await api.put(`/api/orders/${id}/status`, { status });
      fetchOrder(); // Refetch perfectly
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div style={styles.loading}>Loading Request Profile...</div>;
  if (error || !order) return <div style={styles.loading}>{error}</div>;

  return (
    <div style={styles.page}>
      <div className="container" style={{maxWidth: 900}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <Link to="/admin/orders" style={styles.backLink}>← Back to Orders Grid</Link>
          <div style={styles.statusBox}>
            <span style={{ fontSize: 13, marginRight: 10, color: 'var(--color-text-muted)' }}>STATUS:</span>
            <select 
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{
                ...styles.select,
                color: order.status === 'pending' ? '#ff9800' : (order.status === 'shipped' ? '#2196f3' : '#4caf50')
              }}
            >
              <option value="pending">Pending Processing</option>
              <option value="shipped">Package Shipped</option>
              <option value="delivered">Successfully Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <h1 style={styles.title}>Order #{order.id}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 40}}>Placed on {new Date(order.created_at).toLocaleString()}</p>

        <div style={styles.layout}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Customer Profile</h2>
            <div style={styles.field}><span style={styles.label}>Name</span> <span>{order.customer_name}</span></div>
            <div style={styles.field}><span style={styles.label}>Email</span> <span>{order.customer_email}</span></div>
            <div style={styles.field}><span style={styles.label}>Phone</span> <span>{order.phone_number || 'N/A'}</span></div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Delivery Logistics</h2>
            <div style={styles.field}><span style={styles.label}>Address</span> <span>{order.address || 'N/A'}</span></div>
            <div style={styles.field}><span style={styles.label}>City</span> <span>{order.city || 'N/A'}</span></div>
            <div style={styles.field}><span style={styles.label}>Province</span> <span>{order.state || 'N/A'}</span></div>
          </div>
        </div>

        <div style={{...styles.card, marginTop: 30}}>
          <h2 style={styles.cardTitle}>Receipt</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
            <thead>
              <tr>
                <th style={styles.th}>Item</th>
                <th style={{...styles.th, textAlign: 'center'}}>Qty</th>
                <th style={{...styles.th, textAlign: 'right'}}>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={styles.td}>{item.name}</td>
                  <td style={{...styles.td, textAlign: 'center'}}>{item.quantity}</td>
                  <td style={{...styles.td, textAlign: 'right'}}>{Number(item.price).toFixed(2)} PKR</td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid rgba(255,215,0,0.3)'}}>
                <td colSpan="2" style={{...styles.td, fontWeight: 700}}>TOTAL</td>
                <td style={{...styles.td, textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)'}}>{Number(order.total_amount).toFixed(2)} PKR</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { padding: '80px 0', minHeight: '80vh' },
  backLink: {
    color: 'var(--color-primary)',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 700,
    textDecoration: 'none',
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: 42,
    margin: 0,
    color: '#fff'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 30,
  },
  card: {
    background: 'rgba(10, 8, 5, 0.6)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '30px',
    border: '1px solid rgba(255,215,0,0.1)',
  },
  cardTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: 22,
    marginBottom: 20,
    color: 'var(--color-primary)'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 16,
    color: '#e8e0d0',
    fontSize: 15,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-text-muted)',
    marginBottom: 4,
  },
  th: {
    textAlign: 'left',
    padding: '12px 10px',
    color: 'var(--color-text-muted)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  td: {
    padding: '16px 10px',
    color: '#e8e0d0',
  },
  select: {
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '8px 16px',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontWeight: 700,
    outline: 'none',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center', 
    padding: 100, 
    color: 'var(--color-primary)', 
    fontSize: 20,
    fontWeight: 600,
    animation: 'pulse 1.5s infinite',
  }
};
