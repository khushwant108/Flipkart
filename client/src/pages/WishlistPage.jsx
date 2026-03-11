import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  const fetchWishlist = () => {
    setLoading(true);
    axios.get('/api/wishlist')
      .then(({ data }) => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    await toggleWishlist(productId);
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) return <div className="loading-message">Loading your wishlist...</div>;

  if (items.length === 0) {
    return (
      <div className="empty-state-page">
        <div className="empty-icon">🤍</div>
        <h2>Your Wishlist is Empty</h2>
        <p>Save items you love by clicking the heart icon on any product.</p>
        <Link to="/" className="btn-continue-shopping">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-title">My Wishlist <span className="wishlist-count">({items.length} items)</span></h1>
      <div className="wishlist-grid">
        {items.map((item) => {
          const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
          return (
            <div key={item.id} className="wishlist-card">
              <button
                className="wishlist-remove-btn"
                onClick={() => handleRemove(item.product_id)}
                title="Remove from wishlist"
              >
                ✕
              </button>
              <Link to={`/product/${item.product_id}`} className="wishlist-card-image">
                <img
                  src={item.thumbnail || 'https://via.placeholder.com/200x200?text=No+Image'}
                  alt={item.name}
                />
              </Link>
              <div className="wishlist-card-info">
                <Link to={`/product/${item.product_id}`} className="wishlist-item-name">{item.name}</Link>
                <p className="wishlist-item-brand">{item.brand}</p>
                <div className="wishlist-item-price">
                  <span className="price">₹{Number(item.price).toLocaleString()}</span>
                  <span className="mrp">₹{Number(item.mrp).toLocaleString()}</span>
                  <span className="discount">{discount}% off</span>
                </div>
                <button
                  className="btn-add-to-cart-wl"
                  onClick={() => handleAddToCart(item.product_id)}
                  disabled={addingId === item.product_id}
                >
                  {addingId === item.product_id ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WishlistPage;
