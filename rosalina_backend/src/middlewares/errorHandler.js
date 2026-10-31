exports.notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} tidak ditemukan` });
};

exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  // Kode error PostgreSQL
  const map = {
    '23503': [400, 'Data referensi (foreign key) tidak ditemukan atau masih dipakai data lain'],
    '23505': [409, 'Data duplikat'],
    '23514': [400, 'Nilai tidak memenuhi aturan (constraint)'],
    '23502': [400, 'Ada kolom wajib yang kosong'],
    '22P02': [400, 'Format data tidak valid'],
  };
  if (err.code && map[err.code]) {
    return res.status(map[err.code][0]).json({ success: false, message: map[err.code][1] });
  }
  res.status(err.status || 500).json({ success: false, message: err.message || 'Terjadi kesalahan server' });
};
