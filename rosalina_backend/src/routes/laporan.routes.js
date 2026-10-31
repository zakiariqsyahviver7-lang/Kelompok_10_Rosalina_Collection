const router = require('express').Router();
const c = require('../controllers/laporan.controller');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('owner'));
router.get('/', c.getLaporan);
router.get('/download', c.downloadLaporan);

module.exports = router;
