require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Postgres (from .env)
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Simple in-memory token store (for learning)
const tokens = new Map();

/**
 * POST /register
 * body: { username, password }
 */
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, password]
    );

    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Username already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /login
 * body: { username, password }
 */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT id, username FROM users WHERE username = $1 AND password = $2",
    [username, password]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = result.rows[0];
  const token = "token-" + user.id + "-" + Date.now();
  tokens.set(token, user.id);

  res.json({ token, user });
});

/**
 * GET /validate
 * header: Authorization: Bearer <token>
 */
app.get("/validate", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });

  const token = authHeader.replace("Bearer ", "");
  if (!tokens.has(token)) {
    return res.status(401).json({ valid: false });
  }

  res.json({ valid: true, userId: tokens.get(token) });
});

/**
 * GET /health
 */
app.get("/health", (req, res) => {
  res.json({ status: "Auth service OK" });
});

const PORT = process.env.AUTH_PORT || 4000;

app.listen(PORT, () => console.log("Auth service running on", PORT));

