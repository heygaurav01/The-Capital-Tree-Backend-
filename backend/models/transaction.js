// Transaction Model - Tracks user transactions
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Plan = require('./plan');

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
    planId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Plan, key: 'id' } },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed'), defaultValue: 'pending' }
}, { timestamps: true });

Transaction.belongsTo(User, { foreignKey: 'userId' });
Transaction.belongsTo(Plan, { foreignKey: 'planId' });

module.exports = Transaction;
