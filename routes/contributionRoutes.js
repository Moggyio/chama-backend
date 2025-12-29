const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addContribution,
  getMyContributions
} = require("../controllers/contributionController");

router.post("/", auth, addContribution);
router.get("/me", auth, getMyContributions);

module.exports = router;
