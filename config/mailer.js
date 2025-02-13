const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'SendGrid', // Change to 'Mailgun' if needed
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
