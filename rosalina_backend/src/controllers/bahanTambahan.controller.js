const crud = require('../utils/crudFactory');
module.exports = crud({
  table: 'bahan_tambahan', label: 'Bahan tambahan',
  fields: ['nama_bahan', 'satuan', 'harga', 'stok'], required: ['nama_bahan'],
});
