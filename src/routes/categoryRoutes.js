const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// cualquier usuario autenticado puede consultar
router.get('/', categoryController.getAllCategories);

// Solo administradores pueden crear, modificar y eliminar
const adminOnly = roleMiddleware('admin');

router.post('/', adminOnly, categoryController.createCategory);
router.put('/:id', adminOnly, categoryController.updateCategory);
router.delete('/:id', adminOnly, categoryController.deleteCategory);

module.exports = router;
