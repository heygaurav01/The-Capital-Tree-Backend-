const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' },
    otpCode: { type: DataTypes.STRING, allowNull: true },
    otpExpires: { type: DataTypes.DATE, allowNull: true },
    emailVerificationToken: { type: DataTypes.STRING, allowNull: true },
    passwordResetToken: { type: DataTypes.STRING, allowNull: true },
    passwordResetExpires: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: true });

module.exports = User;
