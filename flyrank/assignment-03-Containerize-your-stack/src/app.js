import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

import metaRoutes from './routes/metaRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL('../openapi.json', import.meta.url), 'utf8')
);

export function CreateApp() {
  const app = express();
  app.use(express.json());
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/', metaRoutes);
  app.use('/', taskRoutes);
  app.use(errorHandler);
  return app;
}
