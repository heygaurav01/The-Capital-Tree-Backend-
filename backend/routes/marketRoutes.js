const express = require('express');
const { getStockPrice } = require('../controllers/marketController');

const router = express.Router();

//  Get real-time stock price
router.get('/:symbol', getStockPrice);

module.exports = router;
