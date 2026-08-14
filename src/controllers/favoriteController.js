const Favorite = require('../models/Favorite');
const Event = require('../models/Event');

// POST /api/events/:id/favorite
const addFavorite = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        // que el evento exista
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'La actividad no existe' });
        }

        // que ya esté en favoritos
        const existingFavorite = await Favorite.findOne({ event: eventId, user: userId });
        if (existingFavorite) {
            return res.status(400).json({ success: false, message: 'La actividad ya está en tus favoritos' });
        }

        const newFavorite = await Favorite.create({ event: eventId, user: userId });
        res.status(201).json({ success: true, message: 'Añadido a favoritos exitosamente', data: newFavorite });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'La actividad ya está en tus favoritos' });
        }
        res.status(500).json({ success: false, message: 'Error al añadir a favoritos' });
    }
};

// DELETE /api/events/:id/favorite
const removeFavorite = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const deletedFavorite = await Favorite.findOneAndDelete({ event: eventId, user: userId });

        if (!deletedFavorite) {
            return res.status(404).json({ success: false, message: 'La actividad no estaba en tus favoritos' });
        }

        res.json({ success: true, message: 'Eliminado de favoritos exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar de favoritos' });
    }
};

// GET /api/users/me/favorites
const getMyFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id })
            .populate({
                path: 'event',
                populate: { path: 'category', select: 'name' }
            });

        res.json({ success: true, data: favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener tus favoritos' });
    }
};

module.exports = { addFavorite, removeFavorite, getMyFavorites };
