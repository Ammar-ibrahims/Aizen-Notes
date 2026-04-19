import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('adminToken', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('adminToken');
    }
  }, [token]);



  const login = async (username, password) => {
    const res = await api.post('/api/auth/login', { username, password });
    setToken(res.data.token);
    setAdminUser(res.data.user);
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, adminUser, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
