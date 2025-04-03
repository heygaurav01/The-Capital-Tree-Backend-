const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Transaction = require('./Transaction');

const Payment = sequelize.define('Payment', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    transactionId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Transaction, key: 'id' }
    },
    paymentId: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    paymentRequestId: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    paymentLink: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    status: { 
        type: DataTypes.ENUM('created', 'pending', 'completed', 'failed'), 
        defaultValue: 'created' 
    },
    paymentResponse: { 
        type: DataTypes.JSON, 
        allowNull: true 
    }
}, {
    timestamps: true
});

// Define Associations
Transaction.hasOne(Payment, { foreignKey: 'transactionId', onDelete: 'CASCADE' });
Payment.belongsTo(Transaction, { foreignKey: 'transactionId' });

module.exports = Payment;