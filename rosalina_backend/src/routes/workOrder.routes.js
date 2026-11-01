const router = require('express').Router();
const c = require('../controllers/workOrder.controller');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('owner'));
router.get('/', c.getAll);
router.get('/:id', c.getById);
router.post('/', c.create);
router.patch('/:id/status', c.updateStatus);

module.exports = router;
