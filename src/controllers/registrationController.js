const Registration = require('../models/Registration');
const Event = require('../models/Event');

// POST /api/events/:id/register
const registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        // que el evento exista
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'La actividad no existe' });
        }

        // que esté disponible
        if (!event.isActive) {
            return res.status(400).json({ success: false, message: 'Esta actividad no está disponible para inscripciones' });
        }

        // que el usuario no esté inscrito previamente
        const existingRegistration = await Registration.findOne({ event: eventId, user: userId });
        if (existingRegistration) {
            return res.status(400).json({ success: false, message: 'Ya estás inscrito en esta actividad' });
        }

        // que todavía existan espacios disponibles
        const currentRegistrations = await Registration.countDocuments({ event: eventId });
        if (currentRegistrations >= event.maxCapacity) {
            return res.status(400).json({ success: false, message: 'La actividad ha alcanzado su capacidad máxima' });
        }

        // inscripción
        const newRegistration = await Registration.create({ event: eventId, user: userId });
        res.status(201).json({ success: true, message: 'Inscripción exitosa', data: newRegistration });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe un registro para este usuario en esta actividad' });
        }
        res.status(500).json({ success: false, message: 'Error al procesar la inscripción' });
    }
};

// DELETE /api/events/:id/register
const cancelRegistration = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const deletedRegistration = await Registration.findOneAndDelete({ event: eventId, user: userId });

        if (!deletedRegistration) {
            return res.status(404).json({ success: false, message: 'No estás inscrito en esta actividad' });
        }

        res.json({ success: true, message: 'Inscripción cancelada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al cancelar la inscripción' });
    }
};

// GET /api/users/me/registrations
const getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user._id })
            .populate({
                path: 'event',
                populate: { path: 'category', select: 'name' }
            });

        res.json({ success: true, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener tus inscripciones' });
    }
};

// GET /api/events/:id/participants 
const getEventParticipants = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'La actividad no existe' });
        }

        // que sea el organizador del evento
        if (event.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Solo el organizador de esta actividad puede ver los participantes' });
        }

        const participants = await Registration.find({ event: eventId })
            .populate('user', 'name lastName email role');

        res.json({ success: true, data: participants });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener la lista de participantes' });
    }
};

// POST /api/events/:id/certificate
const requestCertificate = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        // Verificar que el usuario esté inscrito
        const registration = await Registration.findOne({ event: eventId, user: userId })
            .populate('event', 'title date')
            .populate('user', 'name lastName');

        if (!registration) {
            return res.status(403).json({ success: false, message: 'Debes estar inscrito en la actividad para solicitar un certificado.' });
        }

        const event = registration.event;
        const user = registration.user;

        // Llamar a AWS Lambda con API Gateway
        const lambdaUrl = process.env.AWS_LAMBDA_CERTIFICATE_URL;
        if (!lambdaUrl) {
            return res.status(500).json({ success: false, message: 'La URL de AWS Lambda no está configurada.' });
        }

        const formattedDate = event.date ? new Date(event.date).toLocaleDateString() : new Date().toLocaleDateString();
        const fullName = `${user.name} ${user.lastName}`;

        const response = await fetch(lambdaUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: fullName,
                eventName: event.title,
                date: formattedDate
            })
        });

        if (!response.ok) {
            throw new Error('Error al comunicarse con AWS Lambda');
        }

        const data = await response.json();

        // Genera una notificación después de que Lambda procese la tarea
        const Notification = require('../models/Notification');
        await Notification.create({
            user: userId,
            message: `¡Tu certificado para el evento "${event.title}" ha sido generado exitosamente gracias a AWS Lambda!`
        });

        // devolver el PDF al frontend
        res.json({
            success: true,
            message: 'Certificado generado con éxito.',
            pdfBase64: data.pdfBase64
        });

    } catch (error) {
        console.error('Error solicitando certificado:', error);
        res.status(500).json({ success: false, message: 'Error interno al generar el certificado.' });
    }
};

module.exports = { registerForEvent, cancelRegistration, getMyRegistrations, getEventParticipants, requestCertificate };
