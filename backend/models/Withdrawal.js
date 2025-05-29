const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Withdrawal = sequelize.define('Withdrawal', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'id' }
    },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { 
        type: DataTypes.ENUM('pending', 'approved', 'rejected'), 
        defaultValue: 'pending' 
    },
    adminNote: { type: DataTypes.STRING, allowNull: true },
    bankDetails: { type: DataTypes.STRING, allowNull: false }, // JSON string or plaintext
}, {
    timestamps: true
});

User.hasMany(Withdrawal, { foreignKey: 'userId', onDelete: 'CASCADE' });
Withdrawal.belongsTo(User, { foreignKey: 'userId' });

module.exports = Withdrawal;