const express = require('express');
const { getStockPrediction } = require('../controllers/predictionController');

const router = express.Router();

// Get stock prediction
router.get('/:symbol', getStockPrediction);

module.exports = router;
