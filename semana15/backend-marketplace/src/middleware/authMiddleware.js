const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado',
            data: null
        });
    }

    const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    try {
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token inválido o expirado',
            data: null
        });
    }
};

module.exports = { verifyToken };
