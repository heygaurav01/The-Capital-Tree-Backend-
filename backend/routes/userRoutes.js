const express = require('express');
const {
    registerUser, verifyPhone, verifyEmail, loginUser, getUsers, forgotPassword, resetPassword
} = require('../controllers/userController');

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

//  Public Routes
router.post('/register', registerUser);
router.post('/verify-phone', verifyPhone);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

//  Protected Routes (Admin Only)
router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);

module.exports = router;