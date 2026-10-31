const crud = require('../utils/crudFactory');
module.exports = crud({
  table: 'hasil_qc', label: 'Hasil QC',
  fields: ['wo_id', 'jumlah_lolos', 'jumlah_reject', 'tanggal', 'catatan'],
  required: ['wo_id'], filterBy: ['wo_id'],
});
