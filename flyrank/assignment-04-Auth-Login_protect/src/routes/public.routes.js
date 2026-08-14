import express from 'express';
import {getPublicInfo} from '../controllers/public.controller.js';

const router= express.Router();

router.get('/info',getPublicInfo);

export default router;