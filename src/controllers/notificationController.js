const Notification = require('../models/Notification');

// GET /api/users/me/notifications
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 }); // Las mas nuevas primero

        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las notificaciones' });
    }
};

module.exports = {
    getMyNotifications
};
