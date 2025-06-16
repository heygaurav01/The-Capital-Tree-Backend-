// server.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const transactionRoutes = require('./routes/transactionRoutes');  
const analyticsRoutes = require('./routes/analyticsRoutes');
const marketRoutes = require('./routes/marketRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const blogRoutes = require('./routes/blogRoutes');
const faqRoutes = require('./routes/faqRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const bcrypt = require('bcryptjs');
const firebaseUserRoutes = require('./routes/firebaseUserRoutes');
const path = require('path');

// Check environment variables immediately after loading dotenv
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("ALPHA_VANTAGE_API_KEY:", process.env.ALPHA_VANTAGE_API_KEY);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Register Routes
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/firebase-users', firebaseUserRoutes);

// Hashing default passwords for admin and user
bcrypt.hash('Admin@123', 10).then(console.log);
bcrypt.hash('User@123', 10).then(console.log);

// Sync Database
sequelize.sync({ force: false })  // WARNING: This will DROP and recreate all tables!
    .then(() => console.log("Database & tables created"))
    .catch(err => console.error("Error during database sync: ", err));

const PORT = process.env.PORT || 3308;

app.listen(PORT, () => console.log(`The Capital Tree backend running on port ${PORT}`));

module.exports = app;
