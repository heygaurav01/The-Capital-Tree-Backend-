const express = require('express');
const { createFAQ, getFAQs, getFAQById, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

//  Public Route: Get all FAQs
router.get('/', getFAQs);
router.get('/:id', getFAQById);

//  Admin-Only Routes
router.post('/', authMiddleware, roleMiddleware(['admin']), createFAQ);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateFAQ);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteFAQ);

module.exports = router;
