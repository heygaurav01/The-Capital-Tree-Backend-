const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/userController'); // Ensure the file name matches
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers); // Only Admins can view all users

module.exports = router;
