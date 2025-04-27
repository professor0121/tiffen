// testDb.js
const db = require('./utils/db');

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('Database connection OK, 1+1 =', rows[0].result);
  } catch (err) {
    console.error('DB Connection Error:', err);
  } finally {
    process.exit();
  }
}

testConnection();
