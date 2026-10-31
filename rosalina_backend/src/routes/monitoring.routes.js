const router = require('express').Router();
const c = require('../controllers/monitoring.controller');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('owner', 'admin'), c.getStatus);

module.exports = router;
