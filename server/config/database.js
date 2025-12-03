const mysql = require('mysql2');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'baseball_pwa',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Log database connection details
console.log(`🗄️  Connecting to database: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`);

const pool = mysql.createPool(dbConfig);

// Test connection and log result
pool.getConnection((err, connection) => {
  if (err) {
    console.error(`❌ Database connection failed!`);
    console.error(`   Database: ${dbConfig.database}`);
    console.error(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.error(`   Error: ${err.message}`);
    return;
  }
  console.log(`✅ Database connected successfully: ${dbConfig.database}`);
  connection.release();
});

const promisePool = pool.promise();

module.exports = promisePool;
