const pool = require("../config/db");

exports.addContribution = async (req, res) => {
  try {
    const { amount, contribution_date } = req.body;
    const userId = req.user.id;

    if (!amount || !contribution_date) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await pool.query(
      `INSERT INTO contributions (user_id, amount, contribution_date)
       VALUES ($1, $2, $3)`,
      [userId, amount, contribution_date]
    );

    res.status(201).json({ message: "Contribution added" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyContributions = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT amount, contribution_date, status
       FROM contributions
       WHERE user_id = $1
       ORDER BY contribution_date DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
