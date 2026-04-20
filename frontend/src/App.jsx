import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminOrderDetail = lazy(() => import('./pages/AdminOrderDetail'));
import AdminAwayLogger from './components/AdminAwayLogger';
import FloatingCart from './components/FloatingCart';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <AdminAwayLogger />
            <Navbar />
            <FloatingCart />
            <main style={{ minHeight: 'calc(100vh - 160px)' }}>
              <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center', color: 'var(--color-primary)' }}>Loading Premium Experience...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
