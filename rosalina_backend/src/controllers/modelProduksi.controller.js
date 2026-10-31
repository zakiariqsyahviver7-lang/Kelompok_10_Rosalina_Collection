const crud = require('../utils/crudFactory');
module.exports = crud({
  table: 'model_produksi', label: 'Model produksi',
  fields: ['nama_model', 'deskripsi'], required: ['nama_model'],
});
