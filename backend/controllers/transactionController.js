const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Plan = require('../models/Plan');

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

//  Get transactions by user ID
exports.getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.findAll({ where: { userId }, include: [Plan] });
        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this user" });
        }
        res.status(200).json(transactions);
    } catch (error) {
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
