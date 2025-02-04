const Plan = require('../models/plan');

exports.getPlans = async (req, res) => {
    const plans = await Plan.findAll();
    res.json(plans);
};

exports.createPlan = async (req, res) => {
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
};
