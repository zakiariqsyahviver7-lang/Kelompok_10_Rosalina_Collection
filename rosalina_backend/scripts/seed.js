const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

(async () => {
  try {
    const users = [
      { username: 'owner', password: 'owner123', nama: 'Owner Rosalina', role: 'owner' },
      { username: 'admin', password: 'admin123', nama: 'Admin Rosalina', role: 'admin' },
    ];
    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10);
      await pool.query(
        `INSERT INTO users (username, password, nama, role) VALUES ($1,$2,$3,$4)
         ON CONFLICT (username) DO NOTHING`,
        [u.username, hash, u.nama, u.role]
      );
    }
    console.log('Seed user selesai (owner/owner123, admin/admin123)');
  } catch (err) {
    console.error('Seed gagal:', err.message);
  } finally {
    await pool.end();
  }
})();
