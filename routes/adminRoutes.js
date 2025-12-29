const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getAllContributions,
  getAllMembers,
  updateContributionStatus,
  getMonthlySummary
} = require("../controllers/adminController");

// Admin routes
router.get("/members", auth, adminOnly, getAllMembers);
router.get("/contributions", auth, adminOnly, getAllContributions);
router.patch(
  "/contributions/:id/status",
  auth,
  adminOnly,
  updateContributionStatus
);
router.get("/summary/monthly", auth, adminOnly, getMonthlySummary);

module.exports = router;
