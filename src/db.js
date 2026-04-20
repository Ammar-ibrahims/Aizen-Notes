require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('CRITICAL ERROR: DATABASE_URL is not defined in environment variables.');
} else {
  console.log('Database connection attempt initialized...');
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString?.includes('localhost') ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('UNEXPECTED DATABASE ERROR:', err.message);
  if (err.code === '28P01') {
    console.error('HINT: Invalid password in DATABASE_URL.');
  } else if (err.code === '3D000') {
    console.error('HINT: Database name does not exist.');
  }
});

module.exports = pool;
