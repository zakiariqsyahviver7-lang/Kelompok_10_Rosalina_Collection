const pool = require('../config/db');

const SELECT_WO = `
  SELECT wo.*, m.nama_model, k.nama_kain, t.nama_tim
  FROM work_orders wo
  JOIN model_produksi m ON m.id = wo.model_id
  LEFT JOIN kain k ON k.id = wo.kain_id
  LEFT JOIN tim_produksi t ON t.id = wo.tim_id`;

const STATUS = ['dibuat', 'dipotong', 'dijahit', 'qc', 'selesai'];

// Buat_WO() -> Add_WO()
exports.create = async (req, res, next) => {
  try {
    const { model_id, kain_id, tim_id, jumlah_target, deadline, catatan } = req.body;
    if (!model_id || !jumlah_target) {
      return res.status(400).json({ success: false, message: 'model_id dan jumlah_target wajib diisi' });
    }
    const { rows } = await pool.query(
      `INSERT INTO work_orders (model_id, kain_id, tim_id, jumlah_target, deadline, catatan, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [model_id, kain_id || null, tim_id || null, jumlah_target, deadline || null, catatan || null, req.user.id]
    );
    res.status(201).json({ success: true, message: 'WO berhasil dibuat', data: rows[0] });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`${SELECT_WO} ORDER BY wo.id DESC`);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`${SELECT_WO} WHERE wo.id = $1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'WO tidak ditemukan' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: `Status harus salah satu dari: ${STATUS.join(', ')}` });
    }
    const { rows } = await pool.query('UPDATE work_orders SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'WO tidak ditemukan' });
    res.json({ success: true, message: 'Status WO diperbarui', data: rows[0] });
  } catch (err) { next(err); }
};
