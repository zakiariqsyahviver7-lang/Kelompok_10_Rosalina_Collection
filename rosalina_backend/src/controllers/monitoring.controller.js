const pool = require('../config/db');

// Get_Status() -> ambil_status()
exports.getStatus = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { rows } = await pool.query(
      `SELECT wo.id, wo.kode_wo, m.nama_model, wo.jumlah_target, wo.deadline, wo.status,
        COALESCE((SELECT SUM(jumlah_hasil) FROM hasil_potong WHERE wo_id = wo.id),0)::int AS total_potong,
        COALESCE((SELECT SUM(jumlah_hasil) FROM hasil_jahit  WHERE wo_id = wo.id),0)::int AS total_jahit,
        COALESCE((SELECT SUM(jumlah_lolos) FROM hasil_qc     WHERE wo_id = wo.id),0)::int AS total_qc_lolos
       FROM work_orders wo
       JOIN model_produksi m ON m.id = wo.model_id
       WHERE ($1::text IS NULL OR wo.status = $1)
       ORDER BY wo.id DESC`,
      [status || null]
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};
