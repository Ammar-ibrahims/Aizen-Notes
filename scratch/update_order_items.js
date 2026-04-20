const pool = require('../src/db');

async function updateOrderItems() {
  const client = await pool.connect();
  try {
    console.log('Adding variant_ml to order_items...');
    await client.query(`
      ALTER TABLE order_items 
      ADD COLUMN IF NOT EXISTS variant_ml VARCHAR(50);
    `);
    console.log('Success: variant_ml column added.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.release();
    process.exit();
  }
}

updateOrderItems();
