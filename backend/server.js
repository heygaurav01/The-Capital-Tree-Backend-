const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');
const AnalyticsLog = require('./models/AnalyticsLog'); 
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const marketRoutes = require('./routes/marketRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

dotenv.config();

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

// Sync Database
sequelize.sync({ alter: true })
    .then(() => console.log("Database & tables created"))
    .catch(err => console.log("Error: ", err));

const PORT = process.env.PORT || 3307;
app.listen(PORT, () => console.log(`The Capital Tree backend running on port ${PORT}`));

module.exports = app; // Export the app for testing
