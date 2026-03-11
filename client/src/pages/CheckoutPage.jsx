import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const initialForm = {
  shipping_name: '',
  shipping_phone: '',
  shipping_address: '',
  shipping_city: '',
  shipping_pincode: '',
};

function CheckoutPage() {
  const { cartItems, fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validate = () => {
    const errs = {};
    if (!form.shipping_name.trim()) errs.shipping_name = 'Name is required';
    if (!/^\d{10}$/.test(form.shipping_phone)) errs.shipping_phone = 'Enter a valid 10-digit phone number';
    if (!form.shipping_address.trim()) errs.shipping_address = 'Address is required';
    if (!form.shipping_city.trim()) errs.shipping_city = 'City is required';
    if (!/^\d{6}$/.test(form.shipping_pincode)) errs.shipping_pincode = 'Enter a valid 6-digit pincode';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/orders', form);
      await fetchCart();
      navigate(`/order-confirmation/${data.order_id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="loading-message">
        Your cart is empty. <a href="/">Go back to shopping</a>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Shipping Form */}
      <div className="checkout-form-section">
        <h2 className="checkout-title">Delivery Address</h2>
        <form onSubmit={handlePlaceOrder} className="checkout-form" noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="shipping_name"
              value={form.shipping_name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
            {errors.shipping_name && <span className="form-error">{errors.shipping_name}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="shipping_phone"
              value={form.shipping_phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
            {errors.shipping_phone && <span className="form-error">{errors.shipping_phone}</span>}
          </div>

          <div className="form-group">
            <label>Address (House No, Street, Area)</label>
            <textarea
              name="shipping_address"
              value={form.shipping_address}
              onChange={handleChange}
              placeholder="Flat/House No, Colony, Street"
              rows={3}
            />
            {errors.shipping_address && <span className="form-error">{errors.shipping_address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="shipping_city"
                value={form.shipping_city}
                onChange={handleChange}
                placeholder="City"
              />
              {errors.shipping_city && <span className="form-error">{errors.shipping_city}</span>}
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="shipping_pincode"
                value={form.shipping_pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength={6}
              />
              {errors.shipping_pincode && <span className="form-error">{errors.shipping_pincode}</span>}
            </div>
          </div>

          <button type="submit" className="btn-confirm-order" disabled={loading}>
            {loading ? 'Placing Order...' : 'CONFIRM ORDER'}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <aside className="checkout-summary">
        <h3>Order Summary</h3>
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p className="checkout-item-name">{item.name}</p>
                <p className="checkout-item-qty">Qty: {item.quantity}</p>
                <p className="checkout-item-price">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="summary-divider" />
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
      </aside>
    </div>
  );
}

export default CheckoutPage;
