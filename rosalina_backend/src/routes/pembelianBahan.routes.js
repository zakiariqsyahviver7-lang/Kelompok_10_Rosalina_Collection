const router = require('express').Router();
const c = require('../controllers/pembelianBahan.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const crudRouter = require('../utils/crudRouter');

// /total harus didaftarkan sebelum /:id
router.get('/total', authenticate, authorize('admin'), c.hitungTotal);
router.use('/', crudRouter(c, ['admin']));

module.exports = router;
