const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function addLastSeen() {
  try {
    // Check if column exists
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'last_seen';
    `);

    if (res.rows.length === 0) {
      console.log('Adding last_seen column...');
      await pool.query(`ALTER TABLE users ADD COLUMN last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;`);
      console.log('Column added successfully.');
    } else {
      console.log('last_seen column already exists.');
    }
  } catch (err) {
    console.error('Error adding column:', err);
  } finally {
    pool.end();
  }
}

addLastSeen();
