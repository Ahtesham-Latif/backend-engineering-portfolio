import { CreateApp } from './src/app.js';
import { initializeDatabase } from './src/database/db.js';

const app = CreateApp();

const PORT = process.env.PORT || 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on  http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialise database:', error);
    process.exit(1);
  });