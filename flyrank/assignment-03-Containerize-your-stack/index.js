import { CreateApp } from './src/app.js';
import 'dotenv/config';
import { initDatabase } from './src/database/db.js';
const app = CreateApp();

const PORT = process.env.PORT || 3000;

async function startServer(){
  await initDatabase();

  app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();