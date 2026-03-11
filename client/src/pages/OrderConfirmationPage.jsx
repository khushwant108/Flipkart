import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/orders/${orderId}`)
      .then(({ data }) => setOrder(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="loading-message">Loading order details...</div>;
  if (!order) return <div className="loading-message">Order not found.</div>;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-icon">✓</div>
        <h1 className="confirmation-heading">Order Placed Successfully!</h1>
        <p className="confirmation-subtext">
          Your order <strong>#{order.id}</strong> has been confirmed.
        </p>
        <p className="delivery-estimate">
          Estimated Delivery: <strong>{formattedDelivery}</strong>
        </p>

        <div className="confirmation-shipping">
          <h3>Delivering to</h3>
          <p><strong>{order.shipping_name}</strong></p>
          <p>{order.shipping_address}</p>
          <p>{order.shipping_city} – {order.shipping_pincode}</p>
          <p>Phone: {order.shipping_phone}</p>
        </div>

        <div className="confirmation-items">
          <h3>Items Ordered</h3>
          {order.items?.map((item, idx) => (
            <div key={idx} className="confirmation-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p className="item-name">{item.name}</p>
                <p className="item-meta">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="confirmation-total">
          <span>Total Paid:</span>
          <span>₹{parseFloat(order.total_amount).toLocaleString()}</span>
        </div>

        <Link to="/" className="btn-continue-shopping">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
