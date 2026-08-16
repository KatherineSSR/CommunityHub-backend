const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Inscripciones a eventos
router.post('/events/:id/register', registrationController.registerForEvent);
router.delete('/events/:id/register', registrationController.cancelRegistration);

// Certificado de inscripción
router.post('/events/:id/certificate', registrationController.requestCertificate);

// Consultar mis inscripciones
router.get('/users/me/registrations', registrationController.getMyRegistrations);

// Consultar participantes de un evento
router.get('/events/:id/participants', roleMiddleware('organizer'), registrationController.getEventParticipants);

module.exports = router;
