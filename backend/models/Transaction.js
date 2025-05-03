const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Plan = require('./plan');

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'id' }
    },
    planId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Plan, key: 'id' }
    },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed'), defaultValue: 'pending' }
}, {
    timestamps: true
});

// Define Associations
User.hasMany(Transaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Plan.hasMany(Transaction, { foreignKey: 'planId', onDelete: 'CASCADE' });
Transaction.belongsTo(Plan, { foreignKey: 'planId' });

module.exports = Transaction;
