const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { getTransactions, createTransaction } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin']), getTransactions); // Admins can view all transactions
router.post('/', authMiddleware, roleMiddleware(['user']), createTransaction); // Users can create transactions

module.exports = router;
