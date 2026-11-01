const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

pool.query('SELECT NOW()')
  .then(() => {
    console.log('Terhubung ke PostgreSQL');
    app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal konek database:', err.message);
    process.exit(1);
  });
