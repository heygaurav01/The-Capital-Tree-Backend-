const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MarketData = sequelize.define('MarketData', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    symbol: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    volume: { type: DataTypes.INTEGER, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false }
}, {
    timestamps: true
});

module.exports = MarketData;
