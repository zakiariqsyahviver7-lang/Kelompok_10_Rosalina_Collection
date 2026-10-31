const pool = require('../config/db');
const crud = require('../utils/crudFactory');

const base = crud({
  table: 'pembelian_bahan', label: 'Pembelian bahan',
  fields: ['nama_bahan', 'supplier', 'jumlah', 'harga_satuan', 'tanggal'],
  required: ['nama_bahan', 'jumlah', 'harga_satuan'], orderBy: 'tanggal DESC, id DESC',
});

// Hitung Total Pembelian Bahan (opsional filter ?start=YYYY-MM-DD&end=YYYY-MM-DD)
base.hitungTotal = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS jumlah_transaksi, COALESCE(SUM(total_harga),0) AS total_biaya
       FROM pembelian_bahan
       WHERE ($1::date IS NULL OR tanggal >= $1::date)
         AND ($2::date IS NULL OR tanggal <= $2::date)`,
      [start || null, end || null]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

module.exports = base;
