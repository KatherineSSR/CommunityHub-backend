const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// privadas por usuario
router.use(authMiddleware);

router.get('/users/me/notifications', notificationController.getMyNotifications);

module.exports = router;
