import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
           (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:3000' 
            : 'https://mediumorchid-alpaca-129729.hostingersite.com'), // Real Hostinger backend
  timeout: 10000,
});

console.log('API Client Initialized with BaseURL:', api.defaults.baseURL);

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
