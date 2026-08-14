import express from 'express';

export function CreateApp() {
  const app = express();
 // app.use(express.json());

  return app;
}