require('dotenv').config();
const { Pool, types } = require('pg');

// Kolom DATE dikembalikan sebagai string 'YYYY-MM-DD' (hindari pergeseran zona waktu)
types.setTypeParser(1082, (v) => v);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;
