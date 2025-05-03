const { Op } = require('sequelize');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Plan = require('../models/plan');

//  Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { userId, planId, amount, status } = req.body;
console.log(req.body);
        // Validate request data
        if (!userId || !planId || !amount) {
            return res.status(400).json({ message: "User ID, Plan ID, and amount are required." });
        }
console.log(userId, planId, amount, status);
        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
console.log(user);
        // Check if plan exists
        const plan = await Plan.findByPk(planId);
        if (!plan) return res.status(404).json({ message: "Plan not found" });
console.log(plan);
        // Create transaction
        const transaction = await Transaction.create({ userId, planId, amount, status });
        res.status(201).json({ message: "Transaction recorded successfully", transaction });
    } catch (error) {console.log(error);
        res.status(500).json({ error: error.message });
    }
};

//  Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ include: [User, Plan] });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get transactions by user ID with optional period filter
exports.getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;
        const { period } = req.query;

        // Define date filters based on the period
        let dateFilter;
        const now = new Date();

        if (period) {
            switch (period) {
                case 'daily':
                    dateFilter = {
                        [Op.gte]: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                        [Op.lt]: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
                    };
                    break;
                case 'weekly':
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    dateFilter = {
                        [Op.gte]: startOfWeek,
                        [Op.lt]: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 7),
                    };
                    break;
                case 'monthly':
                    dateFilter = {
                        [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1),
                        [Op.lt]: new Date(now.getFullYear(), now.getMonth() + 1, 1),
                    };
                    break;
                case 'yearly':
                    dateFilter = {
                        [Op.gte]: new Date(now.getFullYear(), 0, 1),
                        [Op.lt]: new Date(now.getFullYear() + 1, 0, 1),
                    };
                    break;
                case 'intraday':
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    dateFilter = {
                        [Op.gte]: startOfDay,
                        [Op.lt]: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
                    };
                    break;
                default:
                    return res.status(400).json({ message: 'Invalid period. Use daily, weekly, monthly, yearly, or intraday.' });
            }
        }

        // Fetch transactions for the user with optional date filter
        const whereClause = { userId };
        if (dateFilter) {
            whereClause.createdAt = dateFilter;
        }

        const transactions = await Transaction.findAll({
            where: whereClause,
            include: [Plan],
        });

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this user" });
        }

        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

//  Get transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id, { include: [User, Plan] });
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFilteredTransactions = async (req, res) => {
    try {
        const { period } = req.params;
        // Logic for filtering transactions based on the period
        res.status(200).json({ message: `Filtered transactions for period: ${period}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get aggregated investment data
exports.getInvestmentSummary = async (req, res) => {
    try {
        const { userId } = req.params; // User ID from the route parameter
        const { period } = req.query; // Time period from the query parameter

        // Define date filters based on the period
        let dateFilter;
        const now = new Date();

        switch (period) {
            case 'daily':
                dateFilter = {
                    [Op.gte]: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    [Op.lt]: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
                };
                break;
            case 'weekly':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                dateFilter = {
                    [Op.gte]: startOfWeek,
                    [Op.lt]: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 7),
                };
                break;
            case 'monthly':
                dateFilter = {
                    [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1),
                    [Op.lt]: new Date(now.getFullYear(), now.getMonth() + 1, 1),
                };
                break;
            case 'yearly':
                dateFilter = {
                    [Op.gte]: new Date(now.getFullYear(), 0, 1),
                    [Op.lt]: new Date(now.getFullYear() + 1, 0, 1),
                };
                break;
            case 'intraday':
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                dateFilter = {
                    [Op.gte]: startOfDay,
                    [Op.lt]: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
                };
                break;
            default:
                return res.status(400).json({ message: 'Invalid period. Use daily, weekly, monthly, yearly, or intraday.' });
        }

        // Fetch and aggregate investment data
        const totalInvestment = await Transaction.sum('amount', {
            where: {
                userId,
                createdAt: dateFilter,
            },
        });

        res.status(200).json({
            period,
            totalInvestment: totalInvestment || 0, // Return 0 if no investments are found
        });
    } catch (error) {
        console.error('Error fetching investment summary:', error);
        res.status(500).json({ error: error.message });
    }
};
