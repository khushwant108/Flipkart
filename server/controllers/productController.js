const db = require('../config/db');

// Get all products with optional search and category filter
const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS thumbnail
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (p.name LIKE ? OR p.brand LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }

    query += ` ORDER BY p.created_at DESC`;

    const [products] = await db.execute(query, params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// Get single product with images and specs
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.execute(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    const [images] = await db.execute(
      `SELECT image_url FROM product_images WHERE product_id = ?`,
      [id]
    );

    const [specs] = await db.execute(
      `SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?`,
      [id]
    );

    res.json({ ...product, images: images.map(i => i.image_url), specs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await db.execute(`SELECT * FROM categories`);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
};

module.exports = { getProducts, getProductById, getCategories };
