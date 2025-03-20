const express = require('express');
const { submitFeedback, getAllFeedbacks } = require('../controllers/feedbackController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/', authMiddleware, submitFeedback);

// Admin-Only Routes
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllFeedbacks);

module.exports = router;
