import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function FloatingCart() {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <div className="floating-cart" onClick={() => navigate('/cart')}>
      <div className="floating-cart-inner">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <div className="cart-badge">{totalItems}</div>
      </div>
    </div>
  );
}
