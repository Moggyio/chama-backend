const pool = require("../config/db");

// Get all contributions
exports.getAllContributions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         c.id,
         u.full_name,
         u.email,
         c.amount,
         c.contribution_date,
         c.status
       FROM contributions c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.contribution_date DESC`
    );

    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Update contribution status
exports.updateContributionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await pool.query(
      "UPDATE contributions SET status = $1 WHERE id = $2",
      [status, id]
    );

    res.json({ message: "Contribution status updated" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Monthly summary
exports.getMonthlySummary = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         TO_CHAR(contribution_date, 'YYYY-MM') AS month,
         SUM(amount) AS total
       FROM contributions
       WHERE status = 'confirmed'
       GROUP BY month
       ORDER BY month DESC`
    );

    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
