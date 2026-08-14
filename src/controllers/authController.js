const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, password, lastName, email } = req.body;
        const profileImage = req.file ? req.file.filename : ''; // Si se subió una imagen, guarda su nombre, sino deja vacío

        if (!name || !password || !lastName || !email) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }

        // Verificar que el correo no exista
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.createUser({
            name,
            lastName,
            email,
            password: hashedPassword,
            profileImage: profileImage || ''
        });

        res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios' });
        }

        // Buscar al usuario por email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        // Comparar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        // Generar un token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// GET /api/auth/me
const myProfile = async (req, res) => {
    try {
        // req.user es asignado por el authMiddleware
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// POST /api/auth/logout
const logout = async (req, res) => {
    res.json({ success: true, message: 'Sesión cerrada exitosamente' });
};

module.exports = { register, login, myProfile, logout };