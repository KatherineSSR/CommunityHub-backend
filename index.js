require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use('/api', express.json());
app.use(cors({
    origin: '*',
    methods: '*'
}));

const path = require('path');
//para la foto de perfil
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// REST API
app.use('/api/auth', require('./routes/authRoutes'));

app.listen(process.env.PORT, () => {
    console.log(`REST corriendo en puerto ${process.env.PORT}`);
});

