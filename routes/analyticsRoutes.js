const express = require('express');
const { getDashboardStats, trackUserActivity } = require('../controllers/analyticsController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

//  Dashboard API (Admin Only)
router.get('/dashboard', authMiddleware, roleMiddleware(['admin']), getDashboardStats);

//  Tracking API (For tracking user behavior)
router.post('/track', trackUserActivity);

module.exports = router;
