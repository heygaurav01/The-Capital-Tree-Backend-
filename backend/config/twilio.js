// twilio.js
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

// Ensure environment variables are loaded correctly and provide specific errors
if (!process.env.TWILIO_ACCOUNT_SID) {
    throw new Error("TWILIO_ACCOUNT_SID is missing in the .env file");
}
if (!process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("TWILIO_AUTH_TOKEN is missing in the .env file");
}
if (!process.env.TWILIO_PHONE_NUMBER) {
    throw new Error("TWILIO_PHONE_NUMBER is missing in the .env file");
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendOTP = async (phone, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        console.log(`OTP sent to ${phone}: ${message.sid}`);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

module.exports = {
    sendOTP
};