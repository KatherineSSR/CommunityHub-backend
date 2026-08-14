const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user debe haber sido establecido previamente por el authMiddleware
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. No tienes los permisos necesarios para realizar esta acción.'
            });
        }
        next();
    };
};

module.exports = roleMiddleware; 
