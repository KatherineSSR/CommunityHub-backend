const jwt = require('jsonwebtoken'); //para leer y verificar tokens JWT
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Leer el header Authorization
    const authHeader = req.headers['authorization'];

    // si no hay header, denegar acceso
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Acceso denegado. No se proporcionó token' });
    }

    // Extraer el token (viene como "Bearer <token>")
    const token = authHeader.split(' ')[1];

    // Si no hay token, denegar acceso
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication token required' });
    }

    // Verificar el token sincrónicamente
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expirado' });
    }
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;