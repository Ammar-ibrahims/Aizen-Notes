# Aizen Notes — Perfume Store

A full-stack luxury perfume e-commerce website.

## Architecture

- **Frontend**: React 18 + Vite, served on port 5000
- **Backend**: Node.js + Express API, served on port 3000
- **Database**: PostgreSQL (Replit built-in)

## Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── index.js        # Express server entry
│   │   ├── db.js           # PostgreSQL pool
│   │   ├── migrate.js      # DB schema + seeding
│   │   └── routes/
│   │       ├── products.js # GET /api/products, GET /api/products/:id
│   │       ├── cart.js     # Cart info endpoint
│   │       └── orders.js   # POST /api/orders, GET /api/orders/:email
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── context/CartContext.jsx  # Cart state via localStorage
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Shop.jsx
│   │       ├── ProductDetail.jsx
│   │       ├── Cart.jsx
│   │       └── Checkout.jsx
│   ├── vite.config.js     # Proxy /api → localhost:3000
│   └── package.json
└── package.json
```

## Key Configuration

- Vite dev server: `host: '0.0.0.0', port: 5000, allowedHosts: true`
- API proxy: `/api` → `http://localhost:3000`
- Backend: listens on `localhost:3000`

## Database Tables

- `products` — Perfume catalog (name, description, price, category, image_url, stock)
- `orders` — Customer orders
- `order_items` — Line items per order

## Running the App

The "Start application" workflow runs both backend and frontend:
```
cd backend && node src/index.js & cd frontend && npm run dev
```

To run migration manually:
```
cd backend && node src/migrate.js
```
