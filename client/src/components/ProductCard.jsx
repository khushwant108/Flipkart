import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

function ProductCard({ product }) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img
          src={product.thumbnail || 'https://via.placeholder.com/200x200?text=No+Image'}
          alt={product.name}
          loading="lazy"
        />
        <button
          className={`card-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill={wishlisted ? '#ff3f6c' : 'none'} stroke={wishlisted ? '#ff3f6c' : '#888'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-rating">
          <span className="rating-badge">
            {product.rating} ★
          </span>
          <span className="rating-count">({product.rating_count?.toLocaleString()})</span>
        </div>
        <div className="product-card-price">
          <span className="price">₹{product.price?.toLocaleString()}</span>
          <span className="mrp">₹{product.mrp?.toLocaleString()}</span>
          <span className="discount">{discount}% off</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
