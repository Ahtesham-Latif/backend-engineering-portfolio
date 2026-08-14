import express from 'express';
import authRouter from './routes/auth.routes.js';
import statsRouter from './routes/stats.routes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const swaggerDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));

export function CreateApp() {
  const app = express();
  app.use(express.json());
  app.use('/', statsRouter);
  app.use('/auth', authRouter);
  app.use('/stats', statsRouter);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  return app;
}