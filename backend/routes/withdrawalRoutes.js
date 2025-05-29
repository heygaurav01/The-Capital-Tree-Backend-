const express = require('express');
const {
    requestWithdrawal,
    approveWithdrawal,
    rejectWithdrawal,
    getAllWithdrawals,
    getUserWithdrawals
} = require('../controllers/withdrawalController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// User requests withdrawal
router.post('/', authMiddleware, requestWithdrawal);
// User views their withdrawals
router.get('/my', authMiddleware, getUserWithdrawals);

// Admin views all withdrawals
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllWithdrawals);
// Admin approves/rejects
router.post('/:id/approve', authMiddleware, roleMiddleware(['admin']), approveWithdrawal);
router.post('/:id/reject', authMiddleware, roleMiddleware(['admin']), rejectWithdrawal);

module.exports = router;