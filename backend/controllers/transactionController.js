const Transaction = require('../models/transaction');

exports.getTransactions = async (req, res) => {
    const transactions = await Transaction.findAll({ include: ['User', 'Plan'] });
    res.json(transactions);
};
