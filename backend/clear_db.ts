import pool from './src/config/db';

async function clearDatabase() {
  console.log('Clearing the orders table...');
  try {
    await pool.query('TRUNCATE TABLE orders;');
    console.log('Database is now completely empty!');
  } catch (error) {
    console.error('Failed to clear database:', error);
  } finally {
    await pool.end();
  }
}

clearDatabase();