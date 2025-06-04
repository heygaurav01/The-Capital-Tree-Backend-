const express = require('express');
const { 
    registerUser, verifyPhone, verifyEmail, loginUser, getUsers, forgotPassword, resetPassword, getProfile, updateProfile, uploadKycDocs,
    getUserTotalInvestment, getUserTotalProfitLoss 
} = require('../controllers/userController');

const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' }); // You can customize storage as needed

const router = express.Router();

// Public Routes
router.post('/register', registerUser); 
router.post('/verify-phone', verifyPhone);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Routes (Admin Only)
router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/total-investment', authMiddleware, getUserTotalInvestment);
router.get('/total-profit-loss', authMiddleware, getUserTotalProfitLoss);

// KYC document upload route
router.post(
  '/profile/upload',
  authMiddleware,
  upload.fields([
    { name: 'aadhaarDoc', maxCount: 1 },
    { name: 'panDoc', maxCount: 1 }
  ]),
  uploadKycDocs
);

module.exports = router;
