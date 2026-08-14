const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Category = require('../models/Category');

class StatsService {
    async getDashboardStats() {
        const [
            totalUsers,
            totalEvents,
            activeEvents,
            totalRegistrations,
            totalCategories
        ] = await Promise.all([
            User.countDocuments(),
            Event.countDocuments(),
            Event.countDocuments({ isActive: true }),
            Registration.countDocuments(),
            Category.countDocuments()
        ]);

        return {
            users: totalUsers,
            events: {
                total: totalEvents,
                active: activeEvents,
                inactive: totalEvents - activeEvents
            },
            registrations: totalRegistrations,
            categories: totalCategories
        };
    }
}

module.exports = new StatsService();
