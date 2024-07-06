import { config } from 'dotenv';
import path from 'path';

// Explicitly specify the path to the .env.local file
const result = config({ path: path.resolve('.env.local') });

if (result.error) {
  console.error('Error loading .env.local:', result.error);
  process.exit(1);
}

console.log('Environment variables loaded:', result.parsed);

import { createPool } from '@vercel/postgres';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('POSTGRES_URL is not set');
  process.exit(1);
}

console.log("Using POSTGRES_URL:", connectionString);

const pool = createPool({
  connectionString: connectionString,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected successfully', res.rows[0]);
  }
  pool.end();
});
