import express from 'express'
import {getProfile} from "../controllers/protected.controller.js";

const router= express.Router();

router.get("/profile",getProfile);

export default router;