const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const cors = require('cors');
const User = require('./models/User');   
const Plan = require('./models/plan');
const Transaction = require('./models/transaction');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); // Allow cross-origin requests


// Import Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/plan', require('./routes/planRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Sync Database
sequelize.sync({ alter: true })
    .then(() => console.log("Database & tables created"))
    .catch(err => console.log("Error: ", err));

const PORT = process.env.PORT || 3307   ;
app.listen(PORT, () => console.log(`The Capital Tree backend running on port ${PORT}`));
