const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { createPlan, getPlans } = require('../controllers/planController');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['admin']), createPlan); // Only Admins can create plans

router.get('/', authMiddleware, getPlans); // All users can view plans

module.exports = router;
