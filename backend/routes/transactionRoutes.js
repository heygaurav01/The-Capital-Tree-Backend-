const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { getTransactions, createTransaction } = require('../controllers/transactionController');

const router = express.Router();

// Public Routes
router.get('/', getTransactions);

// Protected Routes
router.post('/', authMiddleware, roleMiddleware(['admin']), createTransaction);

module.exports = router;
