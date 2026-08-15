const statsService = require('../services/statsService');

// GET /api/stats
const getGeneralStats = async (req, res) => {
    try {
        const stats = await statsService.getDashboardStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las estadísticas' });
    }
};

module.exports = { getGeneralStats };
