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

// Solo administradores y organizadores pueden crear, modificar y eliminar
const writeRoles = roleMiddleware('admin', 'organizer');

router.post('/', writeRoles, upload.single('image'), eventController.createEvent);
router.put('/:id', writeRoles, upload.single('image'), eventController.updateEvent);
router.delete('/:id', writeRoles, eventController.deleteEvent);

module.exports = router;
