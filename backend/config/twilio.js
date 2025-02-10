const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

// Ensure environment variables are loaded correctly
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("Twilio credentials are missing in the .env file");
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOTP = async (phone, otp) => {
    return client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
    });
};
