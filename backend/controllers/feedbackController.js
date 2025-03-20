const { User, Feedback } = require('../models'); // Ensure Users model is used for relations

//  Submit Feedback
const submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const userId = req.user.id; // Extract userId from authenticated user

        const feedback = await Feedback.create({
            userId,
            rating,
            comment
        });

        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get All Feedbacks (Admin Only)
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedbacks
};
