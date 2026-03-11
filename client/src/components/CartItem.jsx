import React from 'react';
import { useCart } from '../context/CartContext';

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img
          src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
          alt={item.name}
        />
      </div>

      <div className="cart-item-details">
        <p className="cart-item-name">{item.name}</p>
        <p className="cart-item-brand">Seller: {item.brand}</p>

        <div className="cart-item-price">
          <span className="price">₹{item.price?.toLocaleString()}</span>
          <span className="mrp">₹{item.mrp?.toLocaleString()}</span>
          <span className="discount">{discount}% off</span>
        </div>

        <div className="cart-item-actions">
          <div className="quantity-control">
            <button onClick={handleDecrease} disabled={item.quantity <= 1}>−</button>
            <span>{item.quantity}</span>
            <button onClick={handleIncrease} disabled={item.quantity >= item.stock}>+</button>
          </div>
          <button className="remove-btn" onClick={() => removeItem(item.id)}>
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
