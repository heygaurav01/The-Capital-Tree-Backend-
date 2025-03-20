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

// Get all investment plans
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.findAll();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single investment plan by ID
exports.getPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await Plan.findByPk(id);
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an investment plan
exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.body);  
        const { name, description, price } = req.body;
        console.log(name, description, price);  
        const plan = await Plan.findByPk(id);
        console.log(plan);
        if (!plan) {
            console.log('Plan not found');
            return res.status(404).json({ message: "Plan not found" });
        }
        await plan.update({ name, description, price });
        res.status(200).json({ message: "Plan updated successfully", plan });
    } catch (error) {console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Delete an investment plan
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
