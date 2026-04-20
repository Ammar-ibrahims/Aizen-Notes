const pool = require('../src/db');

async function addVariantsColumn() {
  const client = await pool.connect();
  try {
    console.log('Adding variants column...');
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]';
    `);
    console.log('Success: variants column added.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.release();
    process.exit();
  }
}

addVariantsColumn();
