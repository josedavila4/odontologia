// src/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,             // por ejemplo: 'admin'
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "odontologia",
  password: process.env.DB_PASSWORD,     // ponlo en tu .env
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
