import pkg from 'pg';
const {Pool} =pkg;
console.log('Connecting as DB_USER:', process.env.DB_USER); // Debug line

export const pool = new Pool({
  host:process.env.DB_HOST || 'localhost',
  port:process.env.DB_PORT ? Number(process.env.DB_PORT):5432,
  user:process.env.DB_USER,
  password:String(process.env.DB_PASSWORD),
  database:process.env.DB_NAME,
});

export async function initDatabase(){
  try{
    //Connection Verification
    const res= await pool.query('SELECT NOW()');
    console.log("Connected to PostgreSql at: ", res.rows[0].now);
    //Table Creation if missing
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        done BOOLEAN NOT NULL DEFAULT false
      );
  `);
    //Seeding of record if empty
    const countResult = await pool.query('SELECT COUNT(*) FROM tasks');
    const count = parseInt(countResult.rows[0].count, 10);

    if (count === 0) {
      await pool.query(`
        INSERT INTO tasks (title, done) 
        VALUES 
          ('Buy milk', false),
          ('Read Express docs', true),
          ('Complete Stage 4', false);
      `);
      console.log('Database initialized and seeded with default tasks.');
    } else {
      console.log(`Database ready (${count} tasks found).`);
    }
  }
  catch(error){
    console.error('Error connecting PostgreSQL', error.message);
  }
}
