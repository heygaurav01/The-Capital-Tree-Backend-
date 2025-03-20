const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'SendGrid', // Change to your email service provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:3307/api/users/verify-email/${token}`;
    await transporter.sendMail({
        to: email,
        subject: "Email Verification",
        text: `Click this link to verify your email: ${verificationLink}`
    });
};

exports.sendPasswordResetEmail = async (email, token) => {
    const resetLink = `http://localhost:3307/reset-password?token=${token}`;
    await transporter.sendMail({
        to: email,
        subject: "Password Reset",
        text: `Click this link to reset your password: ${resetLink}`
    });
};
