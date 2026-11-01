const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');

// Router CRUD standar. roles = boleh tulis (POST/PUT/DELETE), readRoles = boleh baca (GET)
module.exports = (controller, roles = ['admin'], readRoles = roles) => {
  const router = express.Router();
  router.use(authenticate);
  router.get('/', authorize(...readRoles), controller.getAll);
  router.get('/:id', authorize(...readRoles), controller.getById);
  router.post('/', authorize(...roles), controller.create);
  router.put('/:id', authorize(...roles), controller.update);
  router.delete('/:id', authorize(...roles), controller.remove);
  return router;
};
