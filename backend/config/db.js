//Making for Main database connection
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize for MySQL connection
const sequelize = new Sequelize(process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Enable logging for debugging SQL queries
});

sequelize.authenticate()
    .then(() => console.log('MySQL Connected'))
    .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
