const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
        user: 'apikey', // This is the literal string 'apikey'
        pass: process.env.EMAIL_PASS // Your SendGrid API Key
    }
});

exports.sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://3.109.55.32:3308/api/users/verify-email/${token}`;
    await transporter.sendMail({
        from: '"The Capital Tree" <gaurav@themedro.com>', // Use your verified sender
        to: email,
        subject: "Email Verification",
        text: `Click this link to verify your email: ${verificationLink}`
    });
};

exports.sendPasswordResetEmail = async (email, token) => {
    const resetLink = `http://3.109.55.32:3308/reset-password?token=${token}`;
    await transporter.sendMail({
        from: '"The Capital Tree" <gaurav@themedro.com>', // Use your verified sender
        to: email,
        subject: "Password Reset",
        text: `Click this link to reset your password: ${resetLink}`
    });
};
