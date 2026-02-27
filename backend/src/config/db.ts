import dotenv from 'dotenv';
import pg from "pg";

const { Pool, types } = pg;

types.setTypeParser(1700, (value) => parseFloat(value));

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
    max: 50,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(1);
});

export default pool;