const pool = require('../config/db');

/**
 * Membuat handler CRUD generik.
 * table/fields berasal dari konstanta di kode (bukan input user), sehingga aman dari SQL injection;
 * semua nilai tetap memakai parameterized query.
 */
module.exports = ({ table, label, fields, required = [], orderBy = 'id DESC', filterBy = [] }) => ({
  // Lihat (list)
  getAll: async (req, res, next) => {
    try {
      const where = [];
      const values = [];
      filterBy.forEach((f) => {
        if (req.query[f] !== undefined) {
          values.push(req.query[f]);
          where.push(`${f} = $${values.length}`);
        }
      });
      const sql = `SELECT * FROM ${table} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ${orderBy}`;
      const { rows } = await pool.query(sql, values);
      res.json({ success: true, data: rows });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ success: false, message: `${label} tidak ditemukan` });
      res.json({ success: true, data: rows[0] });
    } catch (err) { next(err); }
  },

  // Tambah
  create: async (req, res, next) => {
    try {
      const missing = required.filter((f) => req.body[f] === undefined || req.body[f] === '');
      if (missing.length) {
        return res.status(400).json({ success: false, message: `Field wajib diisi: ${missing.join(', ')}` });
      }
      const cols = fields.filter((f) => req.body[f] !== undefined);
      const values = cols.map((c) => req.body[c]);
      const params = cols.map((_, i) => `$${i + 1}`);
      const { rows } = await pool.query(
        `INSERT INTO ${table} (${cols.join(',')}) VALUES (${params.join(',')}) RETURNING *`,
        values
      );
      res.status(201).json({ success: true, message: `${label} berhasil ditambahkan`, data: rows[0] });
    } catch (err) { next(err); }
  },

  // Update
  update: async (req, res, next) => {
    try {
      const cols = fields.filter((f) => req.body[f] !== undefined);
      if (!cols.length) return res.status(400).json({ success: false, message: 'Tidak ada data yang diubah' });
      const sets = cols.map((c, i) => `${c} = $${i + 1}`);
      const values = cols.map((c) => req.body[c]);
      values.push(req.params.id);
      const { rows } = await pool.query(
        `UPDATE ${table} SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
      );
      if (!rows.length) return res.status(404).json({ success: false, message: `${label} tidak ditemukan` });
      res.json({ success: true, message: `${label} berhasil diperbarui`, data: rows[0] });
    } catch (err) { next(err); }
  },

  // Hapus
  remove: async (req, res, next) => {
    try {
      const { rowCount } = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
      if (!rowCount) return res.status(404).json({ success: false, message: `${label} tidak ditemukan` });
      res.json({ success: true, message: `${label} berhasil dihapus` });
    } catch (err) { next(err); }
  },
});
