const { Pool } = require('pg');
const dbConfig = require('../config/db.config'); // Adjust based on the actual path

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Error connecting to the database:', err);
});

module.exports = pool;
