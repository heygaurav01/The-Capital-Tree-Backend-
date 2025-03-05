// usercontroller.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../config/twilio');
const { sendVerificationEmail } = require('../config/mailer');
const crypto = require('crypto');
const { Op } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Register User (No Role)
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        if (!name) return res.status(400).json({ message: "Name is required." });
        if (!confirmPassword) return res.status(400).json({ message: "Confirm password is required." });
        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);
        const emailToken = crypto.randomBytes(32).toString('hex');
        console.log('emailToken', emailToken);

        const user = await User.create({
            name, email, phone, password: hashedPassword,
            otpCode: otp, otpExpires: new Date(Date.now() + 300000),
            emailVerificationToken: emailToken
            
        });console.log(user);

        await sendOTP(phone, otp);
        await sendVerificationEmail(email, emailToken);
console.log(user
    );
        res.status(201).json({ message: 'User registered. Verify phone & email.' });
    } catch (error) {
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
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isPhoneVerified) return res.status(400).json({ message: 'Phone not verified' });
        if (!user.isEmailVerified) return res.status(400).json({ message: 'Email not verified' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
    try {console.log(req.body);
        const { token, newPassword } = req.body;
        console.log(token
        );
        const user = await User.findOne({ where: { passwordResetToken: token, passwordResetExpires: { [Op.gt]: new Date() } } });

        if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(hashed
        );
        await user.update({ password: hashedPassword, passwordResetToken: null, passwordResetExpires: null });

        res.json({ message: "Password reset successfully" });
    } catch (error) {console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Get All Users (Admin Only)
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
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
    getUsers
};