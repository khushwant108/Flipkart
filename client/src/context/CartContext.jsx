import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/api/cart');
      setCartItems(data);
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch (err) {
      console.error('Could not load cart', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    await axios.post('/api/cart', { product_id: productId, quantity });
    fetchCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await axios.put(`/api/cart/${cartItemId}`, { quantity });
    fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await axios.delete(`/api/cart/${cartItemId}`);
    fetchCart();
  };

  const clearCart = async () => {
    await axios.delete('/api/cart/clear');
    fetchCart();
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, fetchCart, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
