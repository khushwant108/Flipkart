const db = require('../config/db');
const nodemailer = require('nodemailer');

// Create reusable transporter - auto-generates Ethereal test account if no creds
let transporterReady = null;
async function getTransporter() {
  if (transporterReady) return transporterReady;
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporterReady = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporterReady = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log('Ethereal test email user:', testAccount.user);
  }
  return transporterReady;
}

async function sendOrderConfirmationEmail(toEmail, toName, orderId, total, items) {
  try {
    const transporter = await getTransporter();
    const itemRows = items
      .map((i) => `<tr><td style="padding:6px">${i.name}</td><td style="padding:6px;text-align:center">${i.quantity}</td><td style="padding:6px;text-align:right">₹${Number(i.price).toLocaleString()}</td></tr>`)
      .join('');
    const info = await transporter.sendMail({
      from: `"Flipkart Clone" <${process.env.EMAIL_FROM || 'noreply@flipkart-clone.com'}>`,
      to: `${toName} <${toEmail}>`,
      subject: `Order Confirmed! Your Order #${orderId} is placed`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto"><div style="background:#2874f0;padding:20px;text-align:center"><h1 style="color:white;margin:0">Flipkart</h1></div><div style="padding:24px;background:#f9f9f9"><h2 style="color:#2874f0">Order Confirmed!</h2><p>Hi ${toName},</p><p>Your order <strong>#${orderId}</strong> has been placed successfully. 🎉</p><h3>Order Summary</h3><table style="width:100%;border-collapse:collapse;background:white"><thead><tr style="background:#e0eaff"><th style="padding:8px;text-align:left">Product</th><th style="padding:8px;text-align:center">Qty</th><th style="padding:8px;text-align:right">Price</th></tr></thead><tbody>${itemRows}</tbody><tfoot><tr><td colspan="2" style="padding:10px;font-weight:bold;text-align:right">Total:</td><td style="padding:10px;font-weight:bold;text-align:right">₹${Number(total).toLocaleString()}</td></tr></tfoot></table><p style="margin-top:20px;color:#555">Thank you for shopping with us!</p></div><div style="padding:12px;text-align:center;font-size:12px;color:#aaa">© 2024 Flipkart Clone</div></div>`,
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log('Preview email at:', previewUrl);
  } catch (err) {
    console.error('Email sending failed (non-critical):', err.message);
  }
}

// Place a new order with shipping details
const placeOrder = async (req, res) => {
  try {
    const { shipping_name, shipping_phone, shipping_address, shipping_city, shipping_pincode } = req.body;

    // Validate required fields
    if (!shipping_name || !shipping_phone || !shipping_address || !shipping_city || !shipping_pincode) {
      return res.status(400).json({ message: 'All shipping details are required' });
    }

    // Get cart items for this user
    const [cartItems] = await db.execute(
      `SELECT ci.quantity, p.id AS product_id, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Insert order
    const [orderResult] = await db.execute(
      `INSERT INTO orders (user_id, total_amount, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_pincode)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.userId, total, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_pincode]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of cartItems) {
      await db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear the cart after placing the order
    await db.execute(`DELETE FROM cart_items WHERE user_id = ?`, [req.userId]);

    // Fetch order items with names for the confirmation email
    const [emailItems] = await db.execute(
      `SELECT oi.quantity, oi.price, p.name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
      [orderId]
    );
    // Get user email for notification (fire-and-forget)
    const [users] = await db.execute(`SELECT name, email FROM users WHERE id = ?`, [req.userId]);
    if (users.length > 0 && users[0].email) {
      sendOrderConfirmationEmail(users[0].email, users[0].name, orderId, total, emailItems);
    }

    res.status(201).json({ message: 'Order placed successfully', order_id: orderId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};

// Get all orders for the user
const getOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [req.userId]
    );

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.execute(
          `SELECT oi.quantity, oi.price, p.name, p.brand,
            (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = ?`,
          [order.id]
        );
        return { ...order, items };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [id, req.userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [items] = await db.execute(
      `SELECT oi.quantity, oi.price, p.name, p.brand, p.id AS product_id,
        (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({ ...orders[0], items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

module.exports = { placeOrder, getOrders, getOrderById };
