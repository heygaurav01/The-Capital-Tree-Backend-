const express = require('express');
const { processPayment, paymentCallback } = require('../controllers/paymentController');
const { generateQRCode } = require('../controllers/qrCodeController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Payment Processing
router.post('/process', authMiddleware, processPayment);
router.get('/callback', paymentCallback);

// QR Code Generation
router.post('/generate-qr', authMiddleware, generateQRCode);

module.exports = router;