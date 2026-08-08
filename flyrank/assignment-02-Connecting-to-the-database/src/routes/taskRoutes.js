import express from 'express';
import * as taskController from '../controllers/taskController.js';

const router = express.Router();

router.get('/tasks', taskController.listTasks);
router.get('/tasks/:id', taskController.getTask);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.get('/stats', taskController.getStats);
router.post('/reset', taskController.resetTasks);

export default router;