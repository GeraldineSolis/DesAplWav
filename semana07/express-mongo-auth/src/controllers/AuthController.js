import authService from '../services/AuthService.js';
import userRepository from '../repositories/UserRepository.js'; 
class AuthController {
    async signUp(req, res, next) {
        try {
            const payload = req.body;
            if (!payload.email || !payload.password) 
                return res.status(400).json({ message: 'El email y password son requeridos' });
            
            const user = await authService.signUp(payload);
            return res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) 
                return res.status(400).json({ message: 'El email y password son requeridos' });
            
            const result = await authService.signIn({ email, password });
            
            const user = await userRepository.findByEmail(email);

            return res.status(200).json({
                token: result.token,
                user: {
                    email: user.email,
                    name: user.name,
                    role: user.roles[0].name 
                }
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();