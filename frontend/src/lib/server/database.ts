import { Pool } from 'pg';

// Vercel serverless: each function instance should keep only a tiny pool.
// A large pool would exhaust Supabase's connection limit across instances.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  // Supabase requires TLS. `rejectUnauthorized: false` keeps this working
  // without shipping their CA bundle into the build.
  ssl: process.env.DATABASE_URL?.includes('sslmode=disable')
    ? false
    : { rejectUnauthorized: false },
});

// Don't kill the whole serverless process on an idle-client error – just log it.
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    console.log('✓ Database connected:', result.rows[0]);
  } finally {
    client.release();
  }
}

export function getPool() {
  return pool;
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
