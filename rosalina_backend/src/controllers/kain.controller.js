const crud = require('../utils/crudFactory');
module.exports = crud({
  table: 'kain', label: 'Kain',
  fields: ['nama_kain', 'jenis', 'warna', 'harga_per_meter', 'stok_meter'], required: ['nama_kain'],
});
