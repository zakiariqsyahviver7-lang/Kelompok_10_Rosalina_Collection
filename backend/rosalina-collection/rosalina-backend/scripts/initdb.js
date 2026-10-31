const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

(async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('Schema berhasil dibuat');
  } catch (err) {
    console.error('Gagal membuat schema:', err.message);
  } finally {
    await pool.end();
  }
})();
