import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    axios.get('/api/orders')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-message">Loading your orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="empty-state-page">
        <div className="empty-icon">📦</div>
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders. Start shopping!</p>
        <Link to="/" className="btn-continue-shopping">Start Shopping</Link>
      </div>
    );
  }

  const statusColors = {
    pending: '#f59e0b',
    confirmed: '#2874f0',
    shipped: '#8b5cf6',
    delivered: '#16a34a',
  };

  return (
    <div className="order-history-page">
      <h1 className="order-history-title">My Orders</h1>
      <div className="order-list">
        {orders.map((order) => {
          const isExpanded = expandedId === order.id;
          return (
            <div key={order.id} className="order-card">
              <div className="order-card-header" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                <div className="order-meta">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="order-right">
                  <span
                    className="order-status-badge"
                    style={{ background: statusColors[order.status] || '#555' }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="order-total">₹{Number(order.total_amount).toLocaleString()}</span>
                  <span className="order-toggle">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="order-card-body">
                  <div className="order-items-list">
                    {order.items?.map((item, i) => (
                      <div key={i} className="order-item-row">
                        <img
                          src={item.image || 'https://via.placeholder.com/60x60?text=No+Image'}
                          alt={item.name}
                        />
                        <div className="order-item-info">
                          <p className="order-item-name">{item.name}</p>
                          <p className="order-item-brand">{item.brand}</p>
                          <p className="order-item-meta">
                            Qty: {item.quantity} &nbsp;|&nbsp; ₹{Number(item.price).toLocaleString()} each
                          </p>
                        </div>
                        <p className="order-item-subtotal">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="order-shipping-info">
                    <strong>Delivered to:</strong> {order.shipping_name}, {order.shipping_address},{' '}
                    {order.shipping_city} – {order.shipping_pincode}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderHistoryPage;
