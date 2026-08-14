import { AuthService } from "../services/auth.service.js";

export class AuthMiddleware {

    static async requireAuth(req, res, next) {
        const authHeader = req.headers.authorization;
        
        // Check for existence and Bearer prefix
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access token required' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        try {

        const user  = await AuthService.verifyToken(token);
        req.user = user;
        req.token = token;
        next();
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
}