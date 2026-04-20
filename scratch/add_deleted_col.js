const pool = require('../src/db');

async function addDeletedColumn() {
  const client = await pool.connect();
  try {
    console.log('Adding is_deleted column...');
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;
    `);
    console.log('Success: is_deleted column added.');
  } catch (err) {
    console.error('Error adding column:', err.message);
  } finally {
    client.release();
    process.exit();
  }
}

addDeletedColumn();
