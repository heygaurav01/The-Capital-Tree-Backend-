const express = require('express');
const { sendNotification, getNotifications } = require('../controllers/notificationController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/send', authMiddleware, sendNotification);
router.get('/', authMiddleware, getNotifications);

module.exports = router;
