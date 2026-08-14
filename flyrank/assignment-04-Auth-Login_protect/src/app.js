import express from 'express';
import authRouter from './routes/auth.routes.js';
import statsRouter from './routes/stats.routes.js';
import publicRouter from './routes/public.routes.js'
import protectedRouter from './routes/protected.routes.js';
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
  app.use('/public',publicRouter);
  app.use('/protected',protectedRouter);
  return app;
}