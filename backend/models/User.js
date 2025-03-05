// User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
    'User',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { name: 'unique_email', msg: 'Email must be unique' },
            validate: {
                 isEmail: {
                   msg: 'Invalid email format'  // Add email validation
                 }
               }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { name: 'unique_phone', msg: 'Phone number must be unique' },
            validate: {
                 isNumeric: {
                   msg: 'Phone number must contain only numbers'  // Add phone number validation
                 }
               }
        },
        password: { type: DataTypes.STRING, allowNull: false },
        isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
        isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
        otpCode: { type: DataTypes.STRING, allowNull: true },
        otpExpires: { type: DataTypes.DATE, allowNull: true },
        emailVerificationToken: { type: DataTypes.STRING, allowNull: true },
        passwordResetToken: { type: DataTypes.STRING, allowNull: true },
        passwordResetExpires: { type: DataTypes.DATE, allowNull: true }
    },
    {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            {
                unique: true,
                fields: ['phone']
            }
        ]
    }
);

module.exports = User;