const User = require('./User');
const Plan = require('./plan');
const Transaction = require('./Transaction');

//Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
//Transaction.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

console.log("User model:", User);
console.log("Plan model:", Plan);

module.exports = {
    User,
<<<<<<< HEAD:backend/models/index.js
    Plan,
    Transaction,
    // other models...
};
=======
    Feedback
};
>>>>>>> 5cf0b6f92e373835e072408f91f16af0d32ab5cf:backend/models/Index.js
