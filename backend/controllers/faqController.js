const FAQ = require('../models/FAQ');

//  Create FAQ
exports.createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = await FAQ.create({ question, answer });
        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get All FAQs
exports.getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.findAll();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get FAQ by ID
exports.getFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findByPk(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });
        res.json(faq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update FAQ (Admin Only)
exports.updateFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = await FAQ.findByPk(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });

        faq.question = question;
        faq.answer = answer;
        await faq.save();
        res.json(faq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Delete FAQ (Admin Only)
exports.deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByPk(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });

        await faq.destroy();
        res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
