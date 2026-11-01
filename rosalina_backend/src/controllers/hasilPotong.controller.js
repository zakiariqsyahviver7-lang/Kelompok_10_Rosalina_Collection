const crud = require('../utils/crudFactory');
module.exports = crud({
  table: 'hasil_potong', label: 'Hasil potong',
  fields: ['wo_id', 'jumlah_hasil', 'tanggal', 'catatan'],
  required: ['wo_id', 'jumlah_hasil'], filterBy: ['wo_id'],
});
