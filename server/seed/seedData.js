const db = require('../config/db');
const bcrypt = require('bcryptjs');

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Mobiles', slug: 'mobiles' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Home & Furniture', slug: 'home-furniture' },
  { name: 'Appliances', slug: 'appliances' },
];

const products = [
  {
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Experience the next level of mobile photography with the Galaxy S23 Ultra. Featuring a 200MP camera, built-in S Pen, and a stunning 6.8-inch Dynamic AMOLED display.',
    price: 74999,
    mrp: 124999,
    brand: 'Samsung',
    rating: 4.5,
    rating_count: 12430,
    stock: 50,
    category: 'mobiles',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
      'https://images.unsplash.com/photo-1592899677977-9c10e588e1f5?w=600',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
    ],
    specs: [
      { key: 'Display', value: '6.8-inch Dynamic AMOLED 2X' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 2' },
      { key: 'RAM', value: '12 GB' },
      { key: 'Storage', value: '256 GB' },
      { key: 'Battery', value: '5000 mAh' },
      { key: 'Camera', value: '200 MP + 12 MP + 10 MP' },
    ],
  },
  {
    name: 'Apple iPhone 15 Pro',
    description: 'iPhone 15 Pro is the first iPhone to feature an aerospace-grade titanium design. A17 Pro chip, Action Button, and the most powerful iPhone camera system ever.',
    price: 119900,
    mrp: 134900,
    brand: 'Apple',
    rating: 4.7,
    rating_count: 8920,
    stock: 35,
    category: 'mobiles',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600',
      'https://images.unsplash.com/photo-1697027345893-bf02a1d8d84a?w=600',
    ],
    specs: [
      { key: 'Display', value: '6.1-inch Super Retina XDR' },
      { key: 'Processor', value: 'A17 Pro chip' },
      { key: 'RAM', value: '8 GB' },
      { key: 'Storage', value: '128 GB' },
      { key: 'Battery', value: '3274 mAh' },
      { key: 'Camera', value: '48 MP + 12 MP + 12 MP' },
    ],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with two processors and eight microphones. 30-hour battery life and multipoint connection. The best wireless headphones for any situation.',
    price: 24990,
    mrp: 34990,
    brand: 'Sony',
    rating: 4.6,
    rating_count: 5670,
    stock: 75,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    ],
    specs: [
      { key: 'Driver Size', value: '30 mm' },
      { key: 'Frequency Response', value: '4 Hz – 40,000 Hz' },
      { key: 'Battery Life', value: '30 hours' },
      { key: 'Connectivity', value: 'Bluetooth 5.2' },
      { key: 'Weight', value: '250 g' },
      { key: 'Noise Cancellation', value: 'Industry-leading ANC' },
    ],
  },
  {
    name: 'Dell XPS 15 Laptop',
    description: 'The XPS 15 OLED delivers immersive visuals with a 15.6-inch OLED display, Intel Core i7 processor, and NVIDIA RTX 4060 graphics. Perfect for creators and professionals.',
    price: 149999,
    mrp: 179999,
    brand: 'Dell',
    rating: 4.4,
    rating_count: 3210,
    stock: 20,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600',
    ],
    specs: [
      { key: 'Display', value: '15.6-inch OLED, 3.5K' },
      { key: 'Processor', value: 'Intel Core i7-13700H' },
      { key: 'RAM', value: '16 GB DDR5' },
      { key: 'Storage', value: '512 GB NVMe SSD' },
      { key: 'Graphics', value: 'NVIDIA RTX 4060' },
      { key: 'Battery', value: '86 Whr' },
    ],
  },
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers unrivaled comfort with its large Air unit and breathable mesh upper. Great for all-day wear, from workouts to casual outings.',
    price: 8995,
    mrp: 12995,
    brand: 'Nike',
    rating: 4.3,
    rating_count: 14200,
    stock: 120,
    category: 'fashion',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
    ],
    specs: [
      { key: 'Material', value: 'Mesh and synthetic' },
      { key: 'Sole', value: 'Rubber' },
      { key: 'Closure', value: 'Lace-up' },
      { key: 'Ideal For', value: 'Running, Casual' },
      { key: 'Air Unit', value: '270-degree heel Air' },
    ],
  },
  {
    name: 'LG 55-inch 4K OLED TV',
    description: 'LG OLED TV with AI-powered 4K picture quality, self-lit OLED pixels, and Dolby Vision & Atmos support. An unmatched home theatre experience.',
    price: 89999,
    mrp: 149990,
    brand: 'LG',
    rating: 4.6,
    rating_count: 6100,
    stock: 15,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600',
    ],
    specs: [
      { key: 'Screen Size', value: '55 inches' },
      { key: 'Resolution', value: '4K Ultra HD (3840 x 2160)' },
      { key: 'Display Type', value: 'OLED' },
      { key: 'HDR', value: 'Dolby Vision, HDR10' },
      { key: 'Smart TV', value: 'webOS 23' },
      { key: 'Audio', value: 'Dolby Atmos, 40W' },
    ],
  },
  {
    name: 'Whirlpool 8 kg Washing Machine',
    description: 'Whirlpool front-load washing machine with 8 kg capacity, 1400 RPM spin speed, and 12 wash programs. IntelliSense technology adapts to your laundry needs automatically.',
    price: 32999,
    mrp: 45000,
    brand: 'Whirlpool',
    rating: 4.2,
    rating_count: 4800,
    stock: 30,
    category: 'appliances',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600',
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600',
    ],
    specs: [
      { key: 'Capacity', value: '8 kg' },
      { key: 'Type', value: 'Front Load' },
      { key: 'Spin Speed', value: '1400 RPM' },
      { key: 'Programs', value: '12 wash programs' },
      { key: 'Energy Rating', value: '5 Star' },
      { key: 'Warranty', value: '2 years comprehensive' },
    ],
  },
  {
    name: 'IKEA KALLAX Shelf Unit',
    description: 'KALLAX shelf unit is a versatile storage solution that works as a room divider, bookcase, or display shelf. Available in multiple colors to match your decor.',
    price: 7499,
    mrp: 9990,
    brand: 'IKEA',
    rating: 4.1,
    rating_count: 9200,
    stock: 60,
    category: 'home-furniture',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
    ],
    specs: [
      { key: 'Dimensions', value: '77 x 77 cm' },
      { key: 'Material', value: 'Particleboard' },
      { key: 'Color', value: 'White' },
      { key: 'Max Load', value: '13 kg per shelf' },
      { key: 'Assembly Required', value: 'Yes' },
    ],
  },
  {
    name: 'Levi\'s 511 Slim Fit Jeans',
    description: 'Levi\'s 511 slim fit jeans offer a modern, tailored silhouette that works for any occasion. Made with stretch denim for comfort throughout the day.',
    price: 2499,
    mrp: 3999,
    brand: 'Levi\'s',
    rating: 4.4,
    rating_count: 22000,
    stock: 200,
    category: 'fashion',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600',
    ],
    specs: [
      { key: 'Fit', value: 'Slim' },
      { key: 'Material', value: '99% Cotton, 1% Elastane' },
      { key: 'Rise', value: 'Mid Rise' },
      { key: 'Closure', value: 'Button and Zip' },
      { key: 'Care', value: 'Machine Wash' },
    ],
  },
  {
    name: 'Bosch 23L Microwave Oven',
    description: 'Bosch solo microwave with 23-litre capacity, 10 power levels, and quick defrost function. Stainless steel interior makes it easy to clean and maintain.',
    price: 8490,
    mrp: 12000,
    brand: 'Bosch',
    rating: 4.2,
    rating_count: 3600,
    stock: 45,
    category: 'appliances',
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
      'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=600',
    ],
    specs: [
      { key: 'Capacity', value: '23 litres' },
      { key: 'Type', value: 'Solo Microwave' },
      { key: 'Power Consumption', value: '800 W' },
      { key: 'Power Levels', value: '10' },
      { key: 'Interior', value: 'Stainless steel' },
      { key: 'Warranty', value: '1 year' },
    ],
  },
  {
    name: 'OnePlus Nord CE 3 Lite',
    description: 'OnePlus Nord CE 3 Lite features a large 5000 mAh battery with 67W SUPERVOOC charging, a 108MP camera, and a 120Hz display at an accessible price point.',
    price: 19999,
    mrp: 24999,
    brand: 'OnePlus',
    rating: 4.1,
    rating_count: 7800,
    stock: 90,
    category: 'mobiles',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600',
    ],
    specs: [
      { key: 'Display', value: '6.72-inch IPS LCD, 120Hz' },
      { key: 'Processor', value: 'Snapdragon 695' },
      { key: 'RAM', value: '8 GB' },
      { key: 'Storage', value: '128 GB' },
      { key: 'Battery', value: '5000 mAh, 67W charging' },
      { key: 'Camera', value: '108 MP + 2 MP + 2 MP' },
    ],
  },
  {
    name: 'Puma Training Sports Shoes',
    description: 'Puma training shoes with EverFit technology provide maximum support during high-intensity workouts. Lightweight with exceptional cushioning for all-day comfort.',
    price: 3499,
    mrp: 5999,
    brand: 'Puma',
    rating: 4.0,
    rating_count: 18500,
    stock: 150,
    category: 'fashion',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600',
      'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600',
    ],
    specs: [
      { key: 'Material', value: 'Synthetic mesh' },
      { key: 'Sole', value: 'EVA rubber' },
      { key: 'Closure', value: 'Lace-up' },
      { key: 'Ideal For', value: 'Training, Gym' },
      { key: 'Technology', value: 'EverFit' },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Run schema migrations (safe for older MySQL)
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN password VARCHAR(255)`);
    } catch (e) {
      if (!e.message.includes('Duplicate column')) console.warn('password column:', e.message);
    }
    await db.execute(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_wishlist (user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Insert default user with hashed password
    const hashedPassword = await bcrypt.hash('password123', 10);
    await db.execute(
      `INSERT IGNORE INTO users (id, name, email, password) VALUES (1, 'Test User', 'test@example.com', ?)`,
      [hashedPassword]
    );
    // Update password if user already exists
    await db.execute(
      `UPDATE users SET password = ? WHERE id = 1 AND (password IS NULL OR password = '')`,
      [hashedPassword]
    );

    // Insert categories
    const categoryIdMap = {};
    for (const cat of categories) {
      await db.execute(
        `INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)`,
        [cat.name, cat.slug]
      );
      const [rows] = await db.execute(`SELECT id FROM categories WHERE slug = ?`, [cat.slug]);
      categoryIdMap[cat.slug] = rows[0].id;
    }

    // Insert products
    for (const product of products) {
      const categoryId = categoryIdMap[product.category];
      const [result] = await db.execute(
        `INSERT INTO products (name, description, price, mrp, brand, rating, rating_count, stock, category_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name, product.description, product.price, product.mrp,
          product.brand, product.rating, product.rating_count, product.stock, categoryId,
        ]
      );
      const productId = result.insertId;

      // Insert images
      for (const url of product.images) {
        await db.execute(
          `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`,
          [productId, url]
        );
      }

      // Insert specs
      for (const spec of product.specs) {
        await db.execute(
          `INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES (?, ?, ?)`,
          [productId, spec.key, spec.value]
        );
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seedDatabase();
