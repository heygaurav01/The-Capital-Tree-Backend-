const express = require('express');
const { createTransaction, getAllTransactions, getUserTransactions, getTransactionById, getFilteredTransactions, getInvestmentSummary } = require('../controllers/transactionController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new transaction (Admin Only)
router.post('/', authMiddleware, createTransaction);

// Get all transactions (Admin Only)
router.get('/', authMiddleware, getAllTransactions);

// Get transactions by user ID (User can view own transactions with optional period filter)
router.get('/user/:userId', authMiddleware, getUserTransactions);

// Get transaction by transaction ID (Admin Only)
router.get('/:id', authMiddleware, getTransactionById);

// Get filtered transactions (Admin Only)
router.get('/filter/:period', authMiddleware, getFilteredTransactions);

// Get investment summary for a user
router.get('/summary/:userId', authMiddleware, getInvestmentSummary);

module.exports = router;

