const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../../controllers/admin/dashboard.controller");
const { verifyToken, isAdmin } = require("../../middlewares/auth.middleware");

// GET /api/admin/dashboard/stats
router.get("/stats", getDashboardStats);

module.exports = router;
