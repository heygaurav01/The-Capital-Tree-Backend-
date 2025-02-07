const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');
const AnalyticsLog = require('./models/AnalyticsLog'); 
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Register Routes
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/transactions', transactionRoutes);  // Add Transaction Management API
app.use('/api/analytics', analyticsRoutes);

// Sync Database
sequelize.sync({ alter: true })  
    .then(() => console.log("Gaurav Database Synced Successfully"))
    .catch(err => console.error(" Database Sync Error:", err));

const PORT = process.env.PORT || 3307;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
