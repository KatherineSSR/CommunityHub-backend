require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Category = require('../models/Category');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const Registration = require('../models/Registration');
const Favorite = require('../models/Favorite');

const seedDB = async () => {
    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        await Promise.all([
            User.deleteMany(),
            Category.deleteMany(),
            Event.deleteMany(),
            Notification.deleteMany(),
            Registration.deleteMany(),
            Favorite.deleteMany()
        ]);

        console.log('Creando Usuarios...');
        const passwordHash = await bcrypt.hash('password123', 10);

        const katherine = await User.create({
            name: 'Katherine',
            lastName: 'Solis',
            email: 'ktssolis36@gmail.com',
            password: passwordHash,
            role: 'admin'
        });

        const osvaldo = await User.create({
            name: 'Osvaldo',
            lastName: 'Zuniga',
            email: 'admin@communityhub.com',
            password: passwordHash,
            role: 'admin'
        });

        const Carlos = await User.create({
            name: 'Carlos',
            lastName: 'Organizador',
            email: 'carlos@communityhub.com',
            password: passwordHash,
            role: 'organizer'
        });

        const Fernanda = await User.create({
            name: 'Fernanda',
            lastName: 'Organizador',
            email: 'fernanda@communityhub.com',
            password: passwordHash,
            role: 'organizer'
        });

        const Maria = await User.create({
            name: 'Maria',
            lastName: 'Usuario',
            email: 'maria@communityhub.com',
            password: passwordHash,
            role: 'user'
        });

        console.log('Creando Categorías...');
        const techCategory = await Category.create({ name: 'Tecnología', description: 'Eventos de programación e IT' });
        const sportsCategory = await Category.create({ name: 'Deportes', description: 'Eventos deportivos y salud' });
        const cultureCategory = await Category.create({ name: 'Cultura', description: 'Eventos culturales y artísticos' });
        const MusicCategory = await Category.create({ name: 'Música', description: 'Eventos musicales y artísticos' });

        console.log('Creando Eventos...');
        const tallerNode = await Event.create({
            title: 'Taller Intensivo de Node.js',
            description: 'Aprende a crear APIs REST escalables con Express y MongoDB.',
            category: techCategory._id,
            date: new Date(new Date().setDate(new Date().getDate() + 5)), // En 5 días
            time: '18:00',
            location: 'Auditorio de Ciencias',
            maxCapacity: 50,
            owner: Carlos._id
        });

        const hackathonAI = await Event.create({
            title: 'Hackathon de Inteligencia Artificial',
            description: 'Competencia de 48 horas para desarrollar agentes inteligentes.',
            category: techCategory._id,
            date: new Date(new Date().setDate(new Date().getDate() + 15)), // En 15 días
            time: '09:00',
            location: 'Centro de Convenciones',
            maxCapacity: 150,
            owner: Carlos._id
        });

        const maratonSalud = await Event.create({
            title: 'Maratón 10K por la Salud',
            description: 'Carrera comunitaria al aire libre. Todos los niveles son bienvenidos.',
            category: sportsCategory._id,
            date: new Date(new Date().setDate(new Date().getDate() + 20)), // En 20 días
            time: '06:00',
            location: 'Parque Central',
            maxCapacity: 500,
            owner: Fernanda._id
        });

        const torneoVoleibol = await Event.create({
            title: 'Torneo Relámpago de Voleibol',
            description: 'Inscribe a tu equipo y compite por el trofeo regional.',
            category: sportsCategory._id,
            date: new Date(new Date().setDate(new Date().getDate() + 8)), // En 8 días
            time: '14:00',
            location: 'Gimnasio Municipal',
            maxCapacity: 80,
            owner: Fernanda._id
        });

        const expoArte = await Event.create({
            title: 'Exposición de Arte Contemporáneo',
            description: 'Galería abierta exhibiendo el trabajo de artistas locales emergentes.',
            category: cultureCategory._id,
            date: new Date(new Date().setDate(new Date().getDate() + 12)), // En 12 días
            time: '17:00',
            location: 'Museo de la Ciudad',
            maxCapacity: 200,
            owner: Carlos._id
        });

        const conciertoAcustico = await Event.create({
            title: 'Concierto Acústico al Atardecer',
            description: 'Disfruta de bandas indie locales tocando en vivo con vista al lago.',
            category: MusicCategory._id,
            date: new Date(new Date().setDate(new Date().getDate() + 3)), // En 3 días
            time: '19:30',
            location: 'Anfiteatro del Lago',
            maxCapacity: 300,
            owner: Fernanda._id
        });

        console.log('Creando algunas Notificaciones de prueba...');
        await Notification.create({
            user: Maria._id,
            title: '¡Bienvenida!',
            message: 'Bienvenida a CommunityHub. Esperamos que disfrutes las actividades.',
            type: 'system'
        });



        console.log('SEED EXITOSO. BD INICIALIZADA.');


        process.exit();
    } catch (error) {
        console.error('Error al correr el seed:', error);
        process.exit(1);
    }
};

seedDB();
