const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MarketData = sequelize.define('MarketData', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    symbol: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    price: { 
        type: DataTypes.FLOAT, 
        allowNull: false 
    },
    open: { 
        type: DataTypes.FLOAT, 
        allowNull: true 
    },
    high: { 
        type: DataTypes.FLOAT, 
        allowNull: true 
    },
    low: { 
        type: DataTypes.FLOAT, 
        allowNull: true 
    },
    volume: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    change: { 
        type: DataTypes.FLOAT, 
        allowNull: true 
    },
    changePercent: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    dataType: { 
        type: DataTypes.STRING, 
        allowNull: true,
        defaultValue: 'quote' // 'quote', 'intraday', 'daily', 'weekly', 'monthly'
    },
    timestamp: { 
        type: DataTypes.DATE, 
        allowNull: false 
    }
}, {
    timestamps: true
});

module.exports = MarketData;