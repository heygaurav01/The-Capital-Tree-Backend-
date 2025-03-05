const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');
const AnalyticsLog = require('./models/AnalyticsLog'); // example
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const marketRoutes = require('./routes/marketRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const blogRoutes = require('./routes/blogRoutes');
const faqRoutes = require('./routes/faqRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const notificationRoutes = require("./routes/notificationRoutes");
const TWILIO_SID = process.env.TWILIO_SID;

dotenv.config();

// Check environment variables immediately after loading dotenv
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);

const app = express();
app.use(express.json());
app.use(cors());

// Register Routes
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use("/api/notifications", notificationRoutes);

// Sync Database
sequelize.sync({ force: true }) // Use force: true cautiously
    .then(() => console.log("Database & tables created"))
    .catch(err => console.error("Error during database sync: ", err));

const PORT = process.env.PORT || 3307;
app.listen(PORT, () => console.log(`The Capital Tree backend running on port ${PORT}`));

module.exports = app; // Export the app for testing