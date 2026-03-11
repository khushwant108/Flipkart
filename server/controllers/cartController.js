const db = require('../config/db');

// Fetch cart items for the user
const getCart = async (req, res) => {
  try {
    const [items] = await db.execute(
      `SELECT ci.id, ci.quantity, ci.product_id,
        p.name, p.price, p.mrp, p.brand, p.stock,
        (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.userId]
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};

// Add item to cart or increase quantity if already exists
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: 'product_id is required' });
    }

    // Check if the product exists
    const [products] = await db.execute(`SELECT id, stock FROM products WHERE id = ?`, [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If item already in cart, increase quantity
    const [existing] = await db.execute(
      `SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?`,
      [req.userId, product_id]
    );

    if (existing.length > 0) {
      const newQty = existing[0].quantity + quantity;
      await db.execute(
        `UPDATE cart_items SET quantity = ? WHERE id = ?`,
        [newQty, existing[0].id]
      );
    } else {
      await db.execute(
        `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`,
        [req.userId, product_id, quantity]
      );
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
};

// Update quantity of a cart item
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    await db.execute(
      `UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?`,
      [quantity, id, req.userId]
    );

    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart item', error: err.message });
  }
};

// Remove an item from cart
const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(
      `DELETE FROM cart_items WHERE id = ? AND user_id = ?`,
      [id, req.userId]
    );
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove cart item', error: err.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    await db.execute(`DELETE FROM cart_items WHERE user_id = ?`, [req.userId]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
