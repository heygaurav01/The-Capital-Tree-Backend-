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
            unique: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            defaultValue: 'user',
            set(value) {
                this.setDataValue('role', value.toLowerCase());
            }
        },
        isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
        isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
        otpCode: { type: DataTypes.STRING, allowNull: true },
        otpExpires: { type: DataTypes.DATE, allowNull: true },
        emailVerificationToken: { type: DataTypes.STRING, allowNull: true },
        passwordResetToken: { type: DataTypes.STRING, allowNull: true },
        passwordResetExpires: { type: DataTypes.DATE, allowNull: true }
    },
    {
        timestamps: true
    }
);

module.exports = User;