const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Favorite = require('../models/Favorite');
const Notification = require('../models/Notification');

// GET /api/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener los usuarios' });
    }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el usuario' });
    }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
    try {
        const { name, lastName, email, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, lastName, email, role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({ success: true, message: 'Usuario actualizado correctamente', data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el usuario' });
    }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Si es organizador, borrar todos sus eventos y los datos que dependan de esos eventos
        if (user.role === 'organizer') {
            const events = await Event.find({ owner: user._id });
            const eventIds = events.map(e => e._id);

            if (eventIds.length > 0) {
                // Borrar inscripciones y favoritos de los eventos de este organizador
                await Registration.deleteMany({ event: { $in: eventIds } });
                await Favorite.deleteMany({ event: { $in: eventIds } });
                // Borrar los eventos en sí
                await Event.deleteMany({ owner: user._id });
            }
        }

        // Borrar todos los datos personales del usuario (inscripciones, favoritos y notificaciones)
        await Registration.deleteMany({ user: user._id });
        await Favorite.deleteMany({ user: user._id });
        await Notification.deleteMany({ user: user._id });

        await user.deleteOne();

        res.json({ success: true, message: 'Usuario y todos sus datos asociados eliminados correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el usuario' });
    }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
