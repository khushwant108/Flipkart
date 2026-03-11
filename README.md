# Flipkart Clone — E-Commerce Application

A full-stack e-commerce web application replicating Flipkart's design and functionality, built as part of the SDE Intern Fullstack Assignment.

---

## Tech Stack

| Layer      | Technology                   |
|------------|------------------------------|
| Frontend   | React.js (Vite), React Router |
| Backend    | Node.js, Express.js          |
| Database   | MySQL                        |
| HTTP Client| Axios                        |

---

## Project Structure

```
flipkart-clone/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Cart state via React Context
│   │   ├── pages/           # Page-level components
│   │   ├── App.jsx          # Route definitions
│   │   ├── main.jsx         # App entry point
│   │   └── index.css        # Global styles
│   └── vite.config.js
│
└── server/                  # Node.js backend
    ├── config/
    │   ├── db.js            # MySQL connection pool
    │   └── schema.sql       # Database schema
    ├── controllers/         # Request handlers
    ├── routes/              # Express route definitions
    ├── seed/
    │   └── seedData.js      # Sample product data
    └── server.js            # Express app entry point
```

---

## Database Schema

**Tables:**
- `users` — default user for cart/orders (no auth required)
- `categories` — product categories (Electronics, Mobiles, Fashion, etc.)
- `products` — product details with price, MRP, brand, rating, stock
- `product_images` — multiple images per product
- `product_specs` — key-value specifications per product
- `cart_items` — user's cart (user_id + product_id with quantity)
- `orders` — placed orders with shipping info and total
- `order_items` — line items for each order

---

## Features Implemented

### Core
- **Product Listing** — grid layout with search by name/brand and filter by category
- **Product Detail** — image carousel, specs table, Add to Cart / Buy Now
- **Shopping Cart** — view, update quantity, remove items, price summary
- **Checkout** — shipping form with validation, order summary review
- **Order Confirmation** — order ID, shipping address, estimated delivery, items list

### Bonus
- Responsive design (mobile, tablet, desktop)
- Loading skeleton animation on product grid
- Empty cart state with illustration

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL 8.0+

### 1. Database Setup

```bash
# Log in to MySQL and run the schema
mysql -u root -p < server/config/schema.sql
```

### 2. Server Setup

```bash
cd server
npm install

# Create your environment file
cp .env.example .env
# Edit .env with your MySQL credentials

# Seed the database with sample products
npm run seed

# Start the development server
npm run dev
```

### 3. Client Setup

```bash
cd client
npm install
npm run dev
```

The client runs at **http://localhost:5173**  
The server runs at **http://localhost:5000**

---

## API Endpoints

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | /api/products         | List products (search/filter)  |
| GET    | /api/products/:id     | Get product details            |
| GET    | /api/products/categories | All categories              |
| GET    | /api/cart             | Get cart items                 |
| POST   | /api/cart             | Add item to cart               |
| PUT    | /api/cart/:id         | Update item quantity           |
| DELETE | /api/cart/:id         | Remove item from cart          |
| DELETE | /api/cart/clear       | Clear entire cart              |
| POST   | /api/orders           | Place an order                 |
| GET    | /api/orders           | Get order history              |
| GET    | /api/orders/:id       | Get single order details       |

---

## Assumptions

1. **No authentication** — A default user (id=1) is seeded and used for all cart and order operations.
2. **MySQL** was chosen for its relational structure, which suits the product-category and order-item relationships well.
3. Product images use Unsplash URLs for demo purposes — replace with real CDN URLs in production.
4. Delivery charges are set to FREE for all orders.
