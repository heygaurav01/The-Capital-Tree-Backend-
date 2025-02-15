const Plan = require('../models/Plan');

// Create a new investment plan
exports.createPlan = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required." });
        }
        const plan = await Plan.create({ name, description, price });
        res.status(201).json({ message: "Plan created successfully", plan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get all investment plans
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.findAll();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Ensure `updatePlan` function exists
exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const plan = await Plan.findByPk(id);
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }
        await plan.update({ name, description, price });
        res.status(200).json({ message: "Plan updated successfully", plan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Delete an investment plan
exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await Plan.findByPk(id);
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }
        await plan.destroy();
        res.status(200).json({ message: "Plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
