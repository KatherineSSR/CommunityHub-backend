const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Inscripciones a eventos
const registerRoles = roleMiddleware('user');
router.post('/events/:id/register', registerRoles, registrationController.registerForEvent);
router.delete('/events/:id/register', registerRoles, registrationController.cancelRegistration);

// Certificado de inscripción
router.post('/events/:id/certificate', registerRoles, registrationController.requestCertificate);

// Consultar mis inscripciones
router.get('/users/me/registrations', registerRoles, registrationController.getMyRegistrations);

// Consultar participantes de un evento
router.get('/events/:id/participants', roleMiddleware('organizer'), registrationController.getEventParticipants);

module.exports = router;
