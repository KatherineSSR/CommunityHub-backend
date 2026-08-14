const Event = require('../models/Event');

// POST /api/events
const createEvent = async (req, res) => {
    try {
        const { title, description, category, date, location, maxCapacity, isActive } = req.body;
        const image = req.file ? req.file.filename : '';

        if (!title) {
            return res.status(400).json({ success: false, message: 'El título de la actividad es obligatorio' });
        }
        if (maxCapacity !== undefined && maxCapacity < 0) {
            return res.status(400).json({ success: false, message: 'La capacidad máxima no puede ser negativa' });
        }
        if (date && new Date(date) < new Date()) {
            return res.status(400).json({ success: false, message: 'La fecha de la actividad no puede estar en el pasado' });
        }

        const newEvent = await Event.create({
            title,
            description,
            category,
            date,
            location,
            maxCapacity,
            image,
            isActive,
            owner: req.user._id // organizador actual
        });

        res.status(201).json({ success: true, message: 'Actividad creada exitosamente', data: newEvent });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe una actividad con este título' });
        }
        res.status(500).json({ success: false, message: 'Error interno del servidor al crear la actividad' });
    }
};

// GET /api/events
const getAllEvents = async (req, res) => {
    try {
        const { category, available } = req.query;
        let filter = {};
        if (category) filter.category = category;
        if (available === 'true') filter.isActive = true;

        const events = await Event.find(filter)
            .populate('category', 'name')
            .populate('owner', 'name lastName email');

        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las actividades' });
    }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('category', 'name description')
            .populate('owner', 'name lastName email');

        if (!event) {
            return res.status(404).json({ success: false, message: 'La actividad no existe' });
        }
        res.json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener la actividad' });
    }
};

// PUT /api/events/:id
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'La actividad no existe' });
        }

        //Solo admin o el dueño pueden editar
        if (req.user.role !== 'admin' && event.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta actividad' });
        }

        const { title, description, category, date, location, maxCapacity, isActive } = req.body;
        let image = event.image;
        if (req.file) {
            image = req.file.filename; // Actualiza imagen si se subió una nueva
        }
        // Validaciones
        if (title !== undefined && title.trim() === '') {
            return res.status(400).json({ success: false, message: 'El título no puede estar vacío' });
        }
        if (maxCapacity !== undefined && maxCapacity < 0) {
            return res.status(400).json({ success: false, message: 'La capacidad máxima no puede ser negativa' });
        }
        if (date && new Date(date) < new Date()) {
            return res.status(400).json({ success: false, message: 'La fecha de la actividad no puede estar en el pasado' });
        }
        // Actualizaciones
        if (title) event.title = title;
        if (description !== undefined) event.description = description;
        if (category) event.category = category;
        if (date) event.date = date;
        if (location !== undefined) event.location = location;
        if (maxCapacity !== undefined) event.maxCapacity = maxCapacity;
        if (isActive !== undefined) event.isActive = isActive;
        event.image = image;

        await event.save();
        res.json({ success: true, message: 'Actividad actualizada correctamente', data: event });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe una actividad con este título' });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar la actividad' });
    }
};

// DELETE /api/events/:id
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'La actividad no existe' });
        }
        // Solo admin o el dueño pueden eliminar
        if (req.user.role !== 'admin' && event.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta actividad' });
        }

        await event.deleteOne();
        res.json({ success: true, message: 'Actividad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar la actividad' });
    }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
