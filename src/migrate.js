const pool = require('./db');
const bcrypt = require('bcryptjs');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        image_url TEXT,
        images TEXT[],
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        city VARCHAR(255),
        state VARCHAR(255),
        address TEXT,
        phone_number VARCHAR(100),
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const existing = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(existing.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO products (name, description, price, category, image_url, stock) VALUES
        ('Rose Noir', 'A dark, sensual blend of Bulgarian rose and oud wood with hints of black pepper.', 89.99, 'Oriental', 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400', 50),
        ('Citrus Bloom', 'A fresh and vibrant fragrance featuring bergamot, lemon zest, and white jasmine.', 64.99, 'Fresh', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 75),
        ('Oud Royale', 'A luxurious and timeless scent with deep oud, sandalwood, and amber.', 129.99, 'Woody', 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=400', 30),
        ('Midnight Musk', 'Soft, powdery musk blended with vanilla and white cedar for a seductive finish.', 74.99, 'Musky', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 60),
        ('Garden of Eden', 'A floral paradise with peony, magnolia, and green leaves evoking morning dew.', 59.99, 'Floral', 'https://images.unsplash.com/photo-1537984822441-cff330075342?w=400', 80),
        ('Desert Gold', 'A warm, spicy journey through frankincense, saffron, and warm amber resin.', 109.99, 'Oriental', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400', 40)
      `);
      console.log('Sample products seeded.');
    }

    const existingAdmin = await client.query('SELECT COUNT(*) FROM admins');
    if (parseInt(existingAdmin.rows[0].count) === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('admin123', salt);
      await client.query(
        'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
        ['admin', hash]
      );
      console.log('Admin user seeded (admin / admin123).');
    }

    console.log('Database migration complete.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    client.release();
  }
}

migrate().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
