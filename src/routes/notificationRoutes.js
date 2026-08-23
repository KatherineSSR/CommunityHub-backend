const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Solo los usuarios tienen notificaciones según el documento
router.get('/users/me/notifications', roleMiddleware('user'), notificationController.getMyNotifications);

module.exports = router;
