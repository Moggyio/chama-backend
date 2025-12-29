require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const contributionRoutes = require("./routes/contributionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Chama backend is running");
});

// Database test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/admin", adminRoutes);

// 🔴 IMPORTANT FIX: use Railway's port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
