import express from 'express'
import { getProfile, getDashboard } from "../controllers/protected.controller.js";
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/profile", AuthMiddleware.requireAuth, getProfile);
router.get("/dashboard", AuthMiddleware.requireAuth, getDashboard);

export default router;