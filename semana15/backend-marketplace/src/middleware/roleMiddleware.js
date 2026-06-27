const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado',
                data: null
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para acceder a este recurso',
                data: null
            });
        }

        next();
    };
};

module.exports = { authorizeRole };
