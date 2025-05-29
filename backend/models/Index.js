const User = require('./User');
const Plan = require('./plan');
const Transaction = require('./Transaction');

//Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
//Transaction.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

console.log("User model:", User);
console.log("Plan model:", Plan);

module.exports = {
    User,
    Plan,
    Transaction,
    // other models...
};
