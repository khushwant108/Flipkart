const db = require('../config/db');

// GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const [items] = await db.execute(
      `SELECT w.id, w.product_id, w.added_at,
              p.name, p.price, p.mrp, p.brand, p.rating, p.rating_count, p.stock,
              (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS thumbnail
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?`,
      [req.userId]
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist', error: err.message });
  }
};

// POST /api/wishlist
const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ message: 'product_id is required' });

    await db.execute(
      `INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)`,
      [req.userId, product_id]
    );
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to wishlist', error: err.message });
  }
};

// DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    await db.execute(
      `DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`,
      [req.userId, productId]
    );
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from wishlist', error: err.message });
  }
};

// GET /api/wishlist/ids  – returns array of wishlisted product IDs for quick lookup
const getWishlistIds = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT product_id FROM wishlist WHERE user_id = ?`,
      [req.userId]
    );
    res.json(rows.map((r) => r.product_id));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist ids', error: err.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, getWishlistIds };
