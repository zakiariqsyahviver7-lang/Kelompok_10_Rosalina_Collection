const pool = require('../config/db');

const queryLaporan = async (start, end) => {
  const { rows } = await pool.query(
    `SELECT wo.kode_wo, m.nama_model, wo.jumlah_target, wo.status,
        TO_CHAR(wo.created_at, 'YYYY-MM-DD') AS tanggal_wo,
        COALESCE((SELECT SUM(jumlah_hasil)  FROM hasil_potong WHERE wo_id = wo.id),0)::int AS total_potong,
        COALESCE((SELECT SUM(jumlah_hasil)  FROM hasil_jahit  WHERE wo_id = wo.id),0)::int AS total_jahit,
        COALESCE((SELECT SUM(jumlah_lolos)  FROM hasil_qc     WHERE wo_id = wo.id),0)::int AS qc_lolos,
        COALESCE((SELECT SUM(jumlah_reject) FROM hasil_qc     WHERE wo_id = wo.id),0)::int AS qc_reject
     FROM work_orders wo
     JOIN model_produksi m ON m.id = wo.model_id
     WHERE ($1::date IS NULL OR wo.created_at::date >= $1::date)
       AND ($2::date IS NULL OR wo.created_at::date <= $2::date)
     ORDER BY wo.created_at DESC`,
    [start || null, end || null]
  );
  return rows;
};

// pilih_periode() -> tampilkan() -> ambil_laporan()
exports.getLaporan = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const data = await queryLaporan(start, end);
    res.json({ success: true, periode: { start: start || null, end: end || null }, data });
  } catch (err) { next(err); }
};

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

// klik_download() -> download() -> ambil_laporan() -> file laporan (CSV)
exports.downloadLaporan = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const data = await queryLaporan(start, end);
    const headers = ['kode_wo', 'nama_model', 'jumlah_target', 'status', 'tanggal_wo', 'total_potong', 'total_jahit', 'qc_lolos', 'qc_reject'];
    const lines = [headers.join(',')];
    data.forEach((r) => lines.push(headers.map((h) => csvCell(r[h])).join(',')));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="laporan-produksi.csv"');
    res.send('\uFEFF' + lines.join('\n'));
  } catch (err) { next(err); }
};
