import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // addToCart accepts optional selectedVariant: { ml, price }
  const addToCart = (product, selectedVariant = null) => {
    const cartKey = selectedVariant ? `${product.id}-${selectedVariant.ml}` : `${product.id}`;
    const itemPrice = selectedVariant ? parseFloat(selectedVariant.price) : parseFloat(product.price);

    setCart(prev => {
      const existing = prev.find(item => item.cartKey === cartKey);
      if (existing) {
        return prev.map(item =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        ...product,
        cartKey,
        price: itemPrice,
        variant_ml: selectedVariant ? selectedVariant.ml : null,
        quantity: 1
      }];
    });
  };

  const removeFromCart = (cartKey) => {
    setCart(prev => prev.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCart(prev =>
      prev.map(item => item.cartKey === cartKey ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
