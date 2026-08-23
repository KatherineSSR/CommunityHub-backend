const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');

// Todas las acciones requieren autenticación
router.use(authMiddleware);

// Cualquier usuario autenticado puede consultar 
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Solo administradores y organizadores pueden modificar y eliminar
const writeRoles = roleMiddleware('admin', 'organizer');

// Solo organizadores pueden crear
router.post('/', roleMiddleware('organizer'), upload.single('image'), eventController.createEvent);

// Admin y organizadores pueden modificar/eliminar
router.put('/:id', writeRoles, upload.single('image'), eventController.updateEvent);
router.delete('/:id', writeRoles, eventController.deleteEvent);

module.exports = router;
