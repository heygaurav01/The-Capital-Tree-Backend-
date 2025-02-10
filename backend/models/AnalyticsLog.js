const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const AnalyticsLog = sequelize.define('AnalyticsLog', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'id' }
    },
    action: { type: DataTypes.STRING, allowNull: false },
    page: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: true
});

// Define Relationship
User.hasMany(AnalyticsLog, { foreignKey: 'userId', onDelete: 'CASCADE' });
AnalyticsLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = AnalyticsLog;
