const express = require('express');
const { createPlan, getAllPlans, updatePlan, deletePlan } = require('../controllers/planController'); // ✅ Import updatePlan
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-only routes (Protect with authentication & admin role)
router.post('/', authMiddleware, roleMiddleware(['admin']), createPlan);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updatePlan);  // ✅ Fix: Ensure updatePlan is imported
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deletePlan);

// Public route (Anyone can view plans)
router.get('/', getAllPlans);

module.exports = router;
