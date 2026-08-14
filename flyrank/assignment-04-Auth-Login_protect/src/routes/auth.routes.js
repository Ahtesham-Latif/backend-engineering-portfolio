import express from 'express';
import {AuthController} from '../controllers/auth.controller.js'
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/logout', AuthMiddleware.requireAuth, AuthController.logout);

export default router;