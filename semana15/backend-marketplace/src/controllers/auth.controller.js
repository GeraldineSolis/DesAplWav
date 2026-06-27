const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos',
                data: null
            });
        }

        // Validar que no exista el usuario
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado',
                data: null
            });
        }

        // Obtener el rol CUSTOMER
        const role = await Role.findOne({ where: { name: 'CUSTOMER' } });
        if (!role) {
            return res.status(500).json({
                success: false,
                message: 'Error: Rol CUSTOMER no existe',
                data: null
            });
        }

        // Crear usuario
        const user = await User.create({
            email,
            password,
            roleId: role.id
        });

        // Generar JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: role.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: role.name
                }
            }
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            data: null
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos',
                data: null
            });
        }

        // Buscar usuario con rol
        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, as: 'role' }]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos',
                data: null
            });
        }

        // Validar contraseña
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos',
                data: null
            });
        }

        // Generar JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role.name
                }
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            data: null
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            include: [{ model: Role, as: 'role' }],
            attributes: ['id', 'email', 'createdAt', 'updatedAt']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'Datos del usuario obtenidos',
            data: {
                id: user.id,
                email: user.email,
                role: user.role.name,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener datos del usuario',
            data: null
        });
    }
};
