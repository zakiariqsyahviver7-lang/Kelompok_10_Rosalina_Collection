const router = require('express').Router();
const crudRouter = require('../utils/crudRouter');

router.use('/auth', require('./auth.routes'));
router.use('/work-orders', require('./workOrder.routes'));
router.use('/monitoring', require('./monitoring.routes'));
router.use('/laporan', require('./laporan.routes'));
router.use('/pembelian-bahan', require('./pembelianBahan.routes'));

// Master data & hasil produksi (role admin)
router.use('/model-produksi', crudRouter(require('../controllers/modelProduksi.controller'), ['admin'], ['admin', 'owner']));
router.use('/kain', crudRouter(require('../controllers/kain.controller'), ['admin'], ['admin', 'owner']));
router.use('/tim-produksi', crudRouter(require('../controllers/timProduksi.controller'), ['admin'], ['admin', 'owner']));
router.use('/bahan-tambahan', crudRouter(require('../controllers/bahanTambahan.controller')));
router.use('/hasil-potong', crudRouter(require('../controllers/hasilPotong.controller')));
router.use('/hasil-jahit', crudRouter(require('../controllers/hasilJahit.controller')));
router.use('/hasil-qc', crudRouter(require('../controllers/hasilQc.controller')));

module.exports = router;
