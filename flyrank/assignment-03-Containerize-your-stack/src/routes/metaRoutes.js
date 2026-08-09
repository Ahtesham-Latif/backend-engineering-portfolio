import express from 'express';

// Create a router for meta routes
const router = express.Router(); // Router function is used to create a new router object that can be used to define routes for the application. It allows you to group related routes together and apply middleware to them.

router.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0.1'
  });
});

router.get('/health', (req, res) => {
    res.json({
        status: 'OK'
    });
});

export default router;