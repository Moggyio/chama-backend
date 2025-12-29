const express = require("express");
const cors = require("cors");

// ❌ DO NOT load dotenv at all on Railway
if (process.env.RAILWAY_ENVIRONMENT === "development") {
  require("dotenv").config();
}

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const contributionRoutes = require("./routes/contributionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chama backend is running");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
