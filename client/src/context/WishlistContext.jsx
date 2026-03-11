import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const fetchWishlistIds = async () => {
    try {
      const { data } = await axios.get('/api/wishlist/ids');
      setWishlistIds(new Set(data));
    } catch {
      // Silently fail – user may not be logged in
    }
  };

  useEffect(() => {
    fetchWishlistIds();
  }, []);

  const toggleWishlist = async (productId) => {
    if (wishlistIds.has(productId)) {
      await axios.delete(`/api/wishlist/${productId}`);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    } else {
      await axios.post('/api/wishlist', { product_id: productId });
      setWishlistIds((prev) => new Set([...prev, productId]));
    }
  };

  const isWishlisted = (productId) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isWishlisted, fetchWishlistIds }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
