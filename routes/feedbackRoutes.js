const express = require('express');
const { submitFeedback, getAllFeedbacks } = require('../controllers/feedbackController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

//  Users can submit feedback
router.post('/', authMiddleware, submitFeedback);

//  Admins can view all feedback
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllFeedbacks);

module.exports = router;
