import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageCarousel from '../components/ImageCarousel';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product.id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    await addToCart(product.id);
    navigate('/cart');
  };

  if (loading) return <div className="loading-message">Loading product...</div>;
  if (!product) return <div className="loading-message">Product not found.</div>;

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="product-detail-page">
      <div className="product-detail-top">
        {/* Image Carousel */}
        <div className="product-detail-images">
          <ImageCarousel images={product.images} productName={product.name} />
          <div className="product-detail-cta">
            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              {addedToCart ? '✓ Added to Cart' : '🛒 ADD TO CART'}
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              ⚡ BUY NOW
            </button>
            <button
              className={`btn-wishlist-detail ${isWishlisted(product.id) ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              title={isWishlisted(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill={isWishlisted(product.id) ? '#ff3f6c' : 'none'} stroke={isWishlisted(product.id) ? '#ff3f6c' : 'currentColor'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {isWishlisted(product.id) ? 'WISHLISTED' : 'WISHLIST'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="product-detail-info">
          <p className="product-brand">{product.brand}</p>
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-rating">
            <span className="rating-badge large">{product.rating} ★</span>
            <span className="rating-count">{product.rating_count?.toLocaleString()} Ratings</span>
            <span className="verified-badge">Flipkart Assured</span>
          </div>

          <div className="product-detail-price">
            <span className="price-large">₹{product.price?.toLocaleString()}</span>
            <span className="mrp">₹{product.mrp?.toLocaleString()}</span>
            <span className="discount-tag">{discount}% off</span>
          </div>

          <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && product.specs.length > 0 && (
        <div className="product-specs">
          <h2>Specifications</h2>
          <table className="specs-table">
            <tbody>
              {product.specs.map((spec, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="spec-key">{spec.spec_key}</td>
                  <td className="spec-value">{spec.spec_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
