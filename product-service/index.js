const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

// Create table
pool.query(`
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  )
`);

// 🔐 Auth middleware
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const response = await fetch("http://3.15.33.107/validate", {
      headers: { Authorization: authHeader }
    });

    if (!response.ok) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const data = await response.json();
    req.userId = data.userId; // 👈 attach userId to request
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Auth service error" });
  }
}

// Public
app.get("/products", requireAuth, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE user_id = $1",
    [req.userId]
  );
  res.json(result.rows);
});

// 🔒 Protected
app.post("/products", requireAuth, async (req, res) => {
  const { name } = req.body;

  const result = await pool.query(
    "INSERT INTO products (name, user_id) VALUES ($1, $2) RETURNING *",
    [name, req.userId]
  );

  res.json(result.rows[0]);
});

app.listen(5000, () => console.log("Product service running on 5000"));
