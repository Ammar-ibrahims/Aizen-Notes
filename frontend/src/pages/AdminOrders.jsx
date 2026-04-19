import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function AdminOrders() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/api/orders/${id}/status`, { status });
      fetchOrders(); // Refresh local list accurately
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div style={styles.loading}>Loading Orders Database...</div>;

  return (
    <div style={styles.page}>
      <div className="container">
        <Link to="/admin" style={styles.backLink}>← Back to Dashboard</Link>
        <h1 style={styles.title}>Global Orders Command</h1>
        
        <div style={styles.card}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--color-text)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,215,0,0.2)' }}>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Total (PKR)</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={styles.td}>#{order.id}</td>
                  <td style={{...styles.td, fontSize: 13}}>
                    <strong>{order.customer_name}</strong><br/>
                    <span style={{color: 'var(--color-text-muted)'}}>{order.customer_email}</span>
                  </td>
                  <td style={{...styles.td, fontWeight: 700}}>
                    {Number(order.total_amount).toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: 12, fontWeight: 700,
                        backgroundColor: order.status === 'pending' ? 'rgba(255,152,0,0.1)' : (order.status === 'shipped' ? 'rgba(33,150,243,0.1)' : 'rgba(76,175,80,0.1)'),
                        color: order.status === 'pending' ? '#ff9800' : (order.status === 'shipped' ? '#2196f3' : '#4caf50')
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <Link to={`/admin/orders/${order.id}`} style={styles.viewBtn}>View Details</Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{...styles.td, textAlign: 'center'}}>No orders found in database.</td>
                </tr>
              )}
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
    display: 'inline-block',
    color: 'var(--color-primary)',
    fontSize: 14,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 700,
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: 32,
    marginBottom: 40,
  },
  card: {
    background: 'rgba(10, 8, 5, 0.6)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '30px',
    border: '1px solid rgba(255,215,0,0.1)',
    overflowX: 'auto',
  },
  th: {
    textAlign: 'left',
    padding: '16px',
    color: 'var(--color-text-muted)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  td: {
    padding: '16px',
    verticalAlign: 'middle',
  },
  select: {
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '8px',
    borderRadius: '4px',
    fontFamily: 'inherit',
    fontWeight: 600,
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
  },
  viewBtn: {
    background: 'rgba(255,215,0,0.1)',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-primary)',
    padding: '6px 14px',
    borderRadius: '4px',
    fontSize: 12,
    fontWeight: 700,
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  }
};
