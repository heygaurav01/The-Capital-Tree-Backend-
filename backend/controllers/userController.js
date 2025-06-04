// usercontroller.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../config/twilio');
const { sendVerificationEmail } = require('../config/mailer');
const crypto = require('crypto');
const { Op } = require('sequelize');
const dotenv = require('dotenv');
const sequelize = require('../config/db'); // Import Sequelize instance

dotenv.config();

// Register User (No Role)
const registerUser = async (req, res) => {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
        const { name, email, phone, password, confirmPassword, role } = req.body;

        if (!name) return res.status(400).json({ message: "Name is required." });
        if (!confirmPassword) return res.status(400).json({ message: "Confirm password is required." });
        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);
        const emailToken = crypto.randomBytes(32).toString('hex');

        const user = await User.create({
            name, email, phone, password: hashedPassword, role,
            otpCode: otp, otpExpires: new Date(Date.now() + 300000),
            emailVerificationToken: emailToken
        }, { transaction }); // Pass the transaction

        await sendOTP(phone, otp); // Send OTP
        await sendVerificationEmail(email, emailToken); // Send email verification

        await transaction.commit(); // Commit the transaction
        res.status(201).json({ message: 'User registered. Verify phone & email.' });
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction on error
        console.error(error); // Log the full error object
        res.status(400).json({ error: error.message, details: error.errors });
    }
};

//  Verify Phone OTP
const verifyPhone = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await User.findOne({ where: { phone, otpCode: otp, otpExpires: { [Op.gt]: new Date() } } });

        if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

        await user.update({ isPhoneVerified: true, otpCode: null, otpExpires: null });

        res.json({ message: 'Phone verified successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Verify Email
const verifyEmail = async (req, res) => {
    try {console.log(req.params);
        const { token } = req.params;
        const user = await User.findOne({ where: { emailVerificationToken: token } });
console.log(user);
        if (!user) return res.status(404).json({ message: 'Invalid token' });

        await user.update({ isEmailVerified: true, emailVerificationToken: null });

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await User.findOne({ where: { email } });
console.log(user);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }console.log(user);

        if (!user.isPhoneVerified) return res.status(400).json({ message: 'Phone not verified' });
        if (!user.isEmailVerified) return res.status(400).json({ message: 'Email not verified' });
console.log('User role:', user.role);
        // Include the role in the JWT payload
        const token = jwt.sign(
            { userId: user.id, role: user.role }, // Add role here
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
console.log('Generated token:', token);
        res.json({ token, message: "Logged in successfully" });
    } catch (error) { console.error(error);
        res.status(500).json({ error: error.message });
    }
};console.log('loginUser function loaded');

//  Forgot Password
const forgotPassword = async (req, res) => {
    try {console.log(req.body);
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
console.log(user);
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString('hex');
        console.log('resetToken', resetToken);
        await user.update({ passwordResetToken: resetToken, passwordResetExpires: new Date(Date.now() + 3600000) });

        await sendVerificationEmail(email, resetToken);

        res.json({ message: "Password reset link sent to email." });
    } catch (error) {console.log(error);
        res.status(500).json({ error: error.message });
    }
};

//  Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        console.log(token   ,newPassword);
        const user = await User.findOne({ where: { passwordResetToken: token, passwordResetExpires: { [Op.gt]: new Date() } } });
console.log(user);
        if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword, passwordResetToken: null, passwordResetExpires: null });
console.log(user);
        res.json({ message: "Password reset successfully" });
    } catch (error) {console.log(err);
        res.status(500).json({ error: error.message });
    }
};

// Get All Users (Admin Only)
const getUsers = async (req, res) => {
    try {
        console.log('getUsers called by:', req.user);
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Resend OTP for phone verification
const resendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ where: { phone } });

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isPhoneVerified) return res.status(400).json({ message: "Phone already verified" });

        // Generate new OTP and expiry
        const otp = Math.floor(100000 + Math.random() * 900000);
        await user.update({
            otpCode: otp,
            otpExpires: new Date(Date.now() + 300000) // 5 minutes from now
        });

        await sendOTP(phone, otp);

        res.json({ message: "OTP resent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get own profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'otpCode', 'otpExpires', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'] }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update profile & KYC
const updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const {
            firstName, lastName, dob, address, city, country, citizenship, taxIdNumber,
            aadhaarNumber, panNumber, aadhaarDocUrl, panDocUrl
        } = req.body;

        // Check if all KYC fields are filled
        const kycCompleted = !!(aadhaarNumber && panNumber && aadhaarDocUrl && panDocUrl);

        await user.update({
            firstName, lastName, dob, address, city, country, citizenship, taxIdNumber,
            aadhaarNumber, panNumber, aadhaarDocUrl, panDocUrl, kycCompleted
        });

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Upload KYC Documents
const uploadKycDocs = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Multer saves files in req.files
        const aadhaarDocUrl = req.files.aadhaarDoc ? req.files.aadhaarDoc[0].path : undefined;
        const panDocUrl = req.files.panDoc ? req.files.panDoc[0].path : undefined;

        await user.update({ aadhaarDocUrl, panDocUrl });

        res.json({ message: "KYC documents uploaded", aadhaarDocUrl, panDocUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 1. API: Get user's total investment (all completed investments)
const getUserTotalInvestment = async (req, res) => {
    try {
        const userId = req.user.id;
        // Sum all completed transactions for this user
        const totalInvestment = await Transaction.sum('amount', {
            where: { userId, status: 'completed' }
        });
        res.json({ totalInvestment: totalInvestment || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. API: Get user's total profit/loss (sum of profit field)
const getUserTotalProfitLoss = async (req, res) => {
    try {
        const userId = req.user.id;
        // Sum profit for all completed transactions for this user
        const totalProfit = await Transaction.sum('profit', {
            where: { userId, status: 'completed' }
        });
        res.json({ totalProfitOrLoss: totalProfit || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    verifyPhone,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
    getUsers,
    resendOTP,
    getProfile,
    updateProfile,
    uploadKycDocs,
    getUserTotalInvestment,     
    getUserTotalProfitLoss       
};