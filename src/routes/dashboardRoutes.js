const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All logged-in users (Viewers, Analysts, Admins) can see the dashboard
router.get('/summary', protect, authorize('viewer', 'analyst', 'admin'), getSummary);

module.exports = router;