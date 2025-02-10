const express = require('express');
const { createTransaction, getAllTransactions, getUserTransactions, getTransactionById } = require('../controllers/transactionController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new transaction (Admin Only)
router.post('/', authMiddleware, roleMiddleware(['admin']), createTransaction);

// Get all transactions (Admin Only)
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllTransactions);

// Get transactions by user ID (User can view own transactions)
router.get('/user/:userId', authMiddleware, getUserTransactions);

// Get transaction by transaction ID (Admin Only)
router.get('/:id', authMiddleware, roleMiddleware(['admin']), getTransactionById);

module.exports = router;
