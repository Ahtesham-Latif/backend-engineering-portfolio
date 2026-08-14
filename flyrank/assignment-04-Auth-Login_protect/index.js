import 'dotenv/config';
import { CreateApp } from './src/app.js';
import { supabase } from './src/config/supabase.js';

const app = CreateApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  // Handshake check with Supabase Auth
  const { error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Supabase handshake failed:', error.message);
  } else {
    console.log(`Server running and connected to Supabase on http://localhost:${PORT}`);
  }
});