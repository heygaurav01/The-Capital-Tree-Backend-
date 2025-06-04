// User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
    'User',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        phone: { type: DataTypes.STRING, allowNull: false, unique: true },
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
        passwordResetExpires: { type: DataTypes.DATE, allowNull: true },

        // Profile & KYC fields
        firstName: { type: DataTypes.STRING, allowNull: true },
        lastName: { type: DataTypes.STRING, allowNull: true },
        dob: { type: DataTypes.DATEONLY, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: true },
        city: { type: DataTypes.STRING, allowNull: true },
        country: { type: DataTypes.STRING, allowNull: true },
        citizenship: { type: DataTypes.STRING, allowNull: true },
        taxIdNumber: { type: DataTypes.STRING, allowNull: true },
        aadhaarNumber: { type: DataTypes.STRING, allowNull: true },
        panNumber: { type: DataTypes.STRING, allowNull: true },
        aadhaarDocUrl: { type: DataTypes.STRING, allowNull: true },
        panDocUrl: { type: DataTypes.STRING, allowNull: true },
        kycCompleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {
        timestamps: true
    }
);

module.exports = User;