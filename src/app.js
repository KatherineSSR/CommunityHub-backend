const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// para acceder a las imagenes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api', require('./routes/registrationRoutes'));
app.use('/api', require('./routes/favoriteRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api', require('./routes/notificationRoutes'));

module.exports = app;
