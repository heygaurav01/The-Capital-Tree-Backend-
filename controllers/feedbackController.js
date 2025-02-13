const { User, Feedback } = require('../models'); // Ensure Users model is used for relations

//  Submit Feedback
const submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const userId = req.user.userId; // Extracted from JWT Token

        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required." });
        }

        const feedback = await Feedback.create({ userId, rating, comment });

        res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get All Feedbacks (Admin Only)
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({ include: { model: User, attributes: ['name', 'email'] } });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedbacks
};
