const express = require('express');
const PaymentController = require('../controllers/paymentController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer routes
router.post('/initiate', authMiddleware, PaymentController.initiatePayment);
router.get('/status/:transactionId', authMiddleware, PaymentController.checkPaymentStatus);

// Admin routes
router.get('/admin/all', 
    authMiddleware, 
    roleMiddleware(['admin']), 
    PaymentController.getAllTransactions
);

router.get('/admin/:transactionId', 
    authMiddleware, 
    roleMiddleware(['admin']), 
    PaymentController.getTransactionDetails
);

router.post('/admin/refund/:transactionId', 
    authMiddleware, 
    roleMiddleware(['admin']), 
    PaymentController.processRefund
);

// Public routes
router.post('/webhook', PaymentController.handleWebhook);
router.get('/callback', PaymentController.paymentCallback);

module.exports = router;