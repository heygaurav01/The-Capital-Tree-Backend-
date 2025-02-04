const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

dotenv.config();
const app = express();
app.use(express.json());

// Import Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Sync Database
sequelize.sync({ alter: true })
    .then(() => console.log("Database & tables created"))
    .catch(err => console.log("Error: ", err));

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => console.log(`The Capital Tree backend running on port ${PORT}`));
