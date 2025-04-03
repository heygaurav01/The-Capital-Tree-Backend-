const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

// Stock quote endpoints
router.get('/quote/:symbol', marketController.getStockPrice);
router.get('/globalquote/:symbol', marketController.getQuote);

// Time series data endpoints
router.get('/intraday/:symbol/:interval?', marketController.getIntradayData);
router.get('/daily/:symbol/:outputsize?', marketController.getDailyData);
router.get('/daily-adjusted/:symbol/:outputsize?', marketController.getDailyAdjustedData);
router.get('/weekly/:symbol', marketController.getWeeklyData);
router.get('/weekly-adjusted/:symbol', marketController.getWeeklyAdjustedData);
router.get('/monthly/:symbol', marketController.getMonthlyData);
router.get('/monthly-adjusted/:symbol', marketController.getMonthlyAdjustedData);

module.exports = router;