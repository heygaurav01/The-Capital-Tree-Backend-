//Create a Prediction API
const axios = require('axios');
const Prediction = require('../models/Prediction');

//  Fetch AI Stock Predictions (Example: Call Python ML API)
exports.getStockPrediction = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        // Call ML Model API (Example: Flask API)
        const predictionResponse = await axios.get(`http://127.0.0.1:5000/predict?symbol=${symbol}`);
        const predictionData = predictionResponse.data;

        // Save to Database
        const prediction = await Prediction.create({
            symbol: symbol.toUpperCase(),
            predictedPrice: predictionData.predicted_price,
            confidence: predictionData.confidence,
            timestamp: new Date()
        });

        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
