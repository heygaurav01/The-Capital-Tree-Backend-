const express = require('express');
const { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan } = require('../controllers/planController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getAllPlans);
router.get('/:id', getPlanById);

// Admin-Only Routes
router.post('/', authMiddleware, roleMiddleware(['admin']), createPlan);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updatePlan);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deletePlan);

module.exports = router;
