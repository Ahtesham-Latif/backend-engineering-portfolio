import { AuthService } from '../services/auth.service.js';

export class AuthController {
  // POST /auth/signup
  static async signup(req, res) {
    const { email, password, full_name, staff_role } = req.body;

    // 1. Input Validation (Status 400)
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const metadata = {
        full_name: full_name || 'Staff Member',
        staff_role: staff_role || 'Line Cook'
      };

      const result = await AuthService.signUp(email, password, metadata);

      // 2. Success Response (Status 201)
      return res.status(201).json({
        message: 'Staff registered successfully',
        user: result.user
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // POST /auth/login
  static async login(req, res) {
    const { email, password } = req.body;

    // 1. Input Validation (Status 400)
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const result = await AuthService.login(email, password);

      // 2. Success Response (Status 200)
      return res.status(200).json({
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
        token_type: 'bearer',
        expires_in: result.session.expires_in,
        user: {
          id: result.user.id,
          email: result.user.email
        }
      });
    } catch (error) {
      // 3. Auth Failure (Status 401)
      return res.status(401).json({ error: 'Invalid login credentials' });
    }
  }
}