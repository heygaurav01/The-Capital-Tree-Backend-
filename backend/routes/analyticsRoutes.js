const express = require('express');
const { getDashboardStats, trackUserActivity } = require('../controllers/analyticsController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-Only Routes
router.get('/dashboard', authMiddleware, roleMiddleware(['admin']), getDashboardStats);

// Public Routes
router.post('/track', trackUserActivity);

module.exports = router;
