import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.ambientGlow}></div>
      <div className="container" style={styles.container}>
        <div className="glass" style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Admin Portal</h1>
            <p style={styles.subtitle}>Secure Access Required</p>
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="Enter admin username"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-3d" 
              style={styles.btn}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Access Vault'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '40px 24px',
  },
  ambientGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 60%)',
    filter: 'blur(60px)',
    zIndex: 0,
  },
  container: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    padding: '48px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-3d-card)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: "var(--font-serif)",
    color: 'var(--color-primary)',
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 8,
  },
  subtitle: {
    color: 'var(--color-text-muted)',
    fontSize: 14,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  error: {
    background: 'rgba(255,50,50,0.1)',
    color: '#ff6b6b',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: 14,
    marginBottom: 24,
    border: '1px solid rgba(255,50,50,0.2)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    color: 'var(--color-text)',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  input: {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,215,0,0.2)',
    padding: '16px',
    borderRadius: '8px',
    color: '#fff',
    fontSize: 16,
    fontFamily: "var(--font-sans)",
    outline: 'none',
    transition: 'border 0.3s',
  },
  btn: {
    marginTop: 16,
    width: '100%',
    padding: '16px',
    fontSize: 14,
  }
};
