const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../config/twilio');
const { sendVerificationEmail } = require('../config/mailer');
const crypto = require('crypto');
const { Op } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

//  Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, role } = req.body;

        // Check if passwords match
        if (!confirmPassword) return res.status(400).json({ message: "Confirm password is required." });
        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

        //  Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const emailToken = crypto.randomBytes(32).toString('hex');

        //  Create User
        const user = await User.create({ 
            name, email, phone, password: hashedPassword, role,
            otpCode: otp, otpExpires: new Date(Date.now() + 300000), // OTP expires in 5 min
            emailVerificationToken: emailToken
        });

        // Send OTP & Email Verification
        await sendOTP(phone, otp);
        await sendVerificationEmail(email, emailToken);

        res.status(201).json({ message: 'User registered. Verify phone & email.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//  Verify Phone OTP
const verifyPhone = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        const user = await User.findOne({ 
            where: { phone, otpCode: otp, otpExpires: { [Op.gt]: new Date() } }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

        //  Update Phone Verification Status
        await user.update({ isPhoneVerified: true, otpCode: null, otpExpires: null });

        res.json({ message: 'Phone verified successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Verify Email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ where: { emailVerificationToken: token } });

        if (!user) return res.status(404).json({ message: 'Invalid token' });

        //  Update Email Verification Status
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
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isPhoneVerified) return res.status(400).json({ message: 'Phone not verified' });
        if (!user.isEmailVerified) return res.status(400).json({ message: 'Email not verified' });

        //  Generate JWT Token
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Forgot Password (Send Reset Link)
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "User not found" });

        //  Generate Password Reset Token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour
        await user.save();

        //  Send Reset Email
        await sendVerificationEmail(email, resetToken);

        res.json({ message: "Password reset link sent to email." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            where: { passwordResetToken: token, passwordResetExpires: { [Op.gt]: new Date() } }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

        // Update Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword, passwordResetToken: null, passwordResetExpires: null });

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get All Users (Admin Only)
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Export all functions properly
module.exports = {
    registerUser,
    verifyPhone,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
    getUsers
};
