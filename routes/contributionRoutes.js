const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/auth");

/**
 * ADD CONTRIBUTION
 */
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Accept both 'date' and 'contribution_date'
    const amount = req.body.amount;
    const contributionDate =
      req.body.contribution_date || req.body.date;

    if (!amount || !contributionDate) {
      return res.status(400).json({
        message: "Amount and contribution date are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO contributions (user_id, amount, contribution_date)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, amount, contributionDate]
    );

    res.status(201).json({
      message: "Contribution added successfully",
      contribution: result.rows[0],
    });
  } catch (err) {
    console.error("Add contribution error:", err);
    res.status(500).json({
      message: "Failed to add contribution",
    });
  }
});

/**
 * GET USER CONTRIBUTIONS
 */
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, amount, contribution_date, status
      FROM contributions
      WHERE user_id = $1
      ORDER BY contribution_date DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch contributions error:", err);
    res.status(500).json({
      message: "Failed to fetch contributions",
    });
  }
});

module.exports = router;
