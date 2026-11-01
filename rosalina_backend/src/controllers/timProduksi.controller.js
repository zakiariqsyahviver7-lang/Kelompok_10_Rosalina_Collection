const crud = require('../utils/crudFactory');
module.exports = crud({
  table: 'tim_produksi', label: 'Tim produksi',
  fields: ['nama_tim', 'nama_karyawan', 'bagian', 'jumlah_anggota'], required: ['nama_karyawan'],
});
