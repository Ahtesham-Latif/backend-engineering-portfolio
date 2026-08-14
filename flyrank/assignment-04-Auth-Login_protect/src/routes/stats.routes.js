import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Stats route is working!',
    'Endpoints are': ['/', '/docs']
  });
});

export default router;
