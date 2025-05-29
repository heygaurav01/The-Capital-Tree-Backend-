const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

// User requests a withdrawal
exports.requestWithdrawal = async (req, res) => {
    try {
        const { amount, bankDetails } = req.body;
        const userId = req.user.id;

        if (!amount || !bankDetails) {
            return res.status(400).json({ message: "Amount and bank details are required." });
        }

        const withdrawal = await Withdrawal.create({ userId, amount, bankDetails });
        res.status(201).json({ message: "Withdrawal request submitted", withdrawal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin approves a withdrawal
exports.approveWithdrawal = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNote } = req.body;
        const withdrawal = await Withdrawal.findByPk(id);

        if (!withdrawal || withdrawal.status !== 'pending') {
            return res.status(404).json({ message: "Pending withdrawal not found" });
        }

        await withdrawal.update({ status: 'approved', adminNote });
        // Here, you would trigger the actual bank transfer logic if integrated

        res.json({ message: "Withdrawal approved", withdrawal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin rejects a withdrawal
exports.rejectWithdrawal = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNote } = req.body;
        const withdrawal = await Withdrawal.findByPk(id);

        if (!withdrawal || withdrawal.status !== 'pending') {
            return res.status(404).json({ message: "Pending withdrawal not found" });
        }

        await withdrawal.update({ status: 'rejected', adminNote });
        res.json({ message: "Withdrawal rejected", withdrawal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all withdrawals (admin)
exports.getAllWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.findAll({ include: [User] });
        res.json(withdrawals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's own withdrawals
exports.getUserWithdrawals = async (req, res) => {
    try {
        const userId = req.user.id;
        const withdrawals = await Withdrawal.findAll({ where: { userId } });
        res.json(withdrawals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};