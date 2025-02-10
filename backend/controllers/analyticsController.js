const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Plan = require('../models/Plan');
const AnalyticsLog = require('../models/AnalyticsLog');

// Dashboard API: Provides investment, revenue, and activity data
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalRevenue = await Transaction.sum('amount');
        const totalTransactions = await Transaction.count();

        const investmentsByPlan = await Plan.findAll({
            attributes: ['name', [Transaction.sequelize.fn('COUNT', 'planId'), 'investmentCount']],
            include: [{ model: Transaction, attributes: [] }],
            group: ['Plan.id']
        });

        res.status(200).json({
            totalUsers,
            totalRevenue,
            totalTransactions,
            investmentsByPlan
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Tracking API: Tracks user activity (Can integrate Google Analytics)
exports.trackUserActivity = async (req, res) => {
    try {
        const { userId, action, page } = req.body;

        if (!userId || !action || !page) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        //  Store tracking log in the database
        const log = await AnalyticsLog.create({ userId, action, page });

        res.status(200).json({ message: "User activity tracked successfully", log });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
