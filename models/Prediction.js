const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Prediction = sequelize.define('Prediction', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    symbol: { type: DataTypes.STRING, allowNull: false },
    predictedPrice: { type: DataTypes.FLOAT, allowNull: false },
    confidence: { type: DataTypes.FLOAT, allowNull: false }, // Accuracy of the prediction
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
    timestamps: true
});

module.exports = Prediction;
