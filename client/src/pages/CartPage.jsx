import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

function CartPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalMrp = cartItems.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const totalDiscount = totalMrp - subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <img
          src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png"
          alt="Empty cart"
          className="empty-cart-img"
        />
        <h2>Your cart is empty!</h2>
        <p>Add items to it now.</p>
        <Link to="/" className="btn-shop-now">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items-section">
        <h2 className="cart-title">My Cart ({cartItems.length})</h2>
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
        <div className="cart-place-order-bar">
          <button className="btn-place-order" onClick={() => navigate('/checkout')}>
            PLACE ORDER
          </button>
        </div>
      </div>

      {/* Price Summary */}
      <aside className="cart-summary">
        <h3 className="summary-title">PRICE DETAILS</h3>
        <div className="summary-row">
          <span>Price ({cartItems.length} items)</span>
          <span>₹{totalMrp.toLocaleString()}</span>
        </div>
        <div className="summary-row discount">
          <span>Discount</span>
          <span>− ₹{totalDiscount.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Charges</span>
          <span className="free-delivery">FREE</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <p className="savings-msg">
          You will save ₹{totalDiscount.toLocaleString()} on this order
        </p>
        <button className="btn-place-order full-width" onClick={() => navigate('/checkout')}>
          PLACE ORDER
        </button>
      </aside>
    </div>
  );
}

export default CartPage;
