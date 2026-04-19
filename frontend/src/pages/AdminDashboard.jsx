import React, { useCallback } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIdleTimeout } from '../hooks/useIdleTimeout';

export default function AdminDashboard() {
  const { isAuthenticated, adminUser, logout } = useAuth();
  const navigate = useNavigate();



  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <div className="glass" style={styles.card}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Welcome, {adminUser?.username}</h1>
              <p style={styles.subtitle}>Aizen Notes Store Operations</p>
            </div>
            <button className="btn-3d" onClick={logout} style={styles.logoutBtn}>
              Sign Out
            </button>
          </div>
          
          <div style={styles.grid}>
            <div style={styles.module}>
              <h3 style={styles.moduleTitle}>Products</h3>
              <p style={styles.moduleDesc}>Add, edit, or remove perfumes from your catalog.</p>
              <Link to="/admin/products" style={styles.actionBtn}>Manage Products</Link>
            </div>
            <div style={styles.module}>
              <h3 style={styles.moduleTitle}>Orders</h3>
              <p style={styles.moduleDesc}>View incoming customer orders and manage fulfillment.</p>
              <Link to="/admin/orders" style={{...styles.actionBtn, display: 'inline-block', textAlign: 'center'}}>View Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '60px 0', minHeight: '80vh' },
  card: {
    padding: '48px',
    borderRadius: 'var(--radius-lg)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 48,
    flexWrap: 'wrap',
    gap: 24,
  },
  title: {
    fontFamily: "var(--font-serif)",
    color: 'var(--color-primary)',
    fontSize: 40,
    marginBottom: 8,
  },
  subtitle: {
    color: 'var(--color-text-muted)',
    fontSize: 16,
    letterSpacing: '0.1em',
  },
  logoutBtn: {
    padding: '12px 24px',
    fontSize: 12,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 32,
  },
  module: {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,215,0,0.1)',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  moduleTitle: {
    fontFamily: "var(--font-serif)",
    color: '#fff',
    fontSize: 24,
  },
  moduleDesc: {
    color: 'var(--color-text-muted)',
    lineHeight: 1.6,
    flex: 1,
  },
  actionBtn: {
    background: 'transparent',
    border: '1px solid var(--color-primary)',
    color: 'var(--color-primary)',
    padding: '12px',
    borderRadius: '8px',
    fontFamily: "var(--font-sans)",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    marginTop: 8,
    transition: 'var(--transition)',
  }
};
