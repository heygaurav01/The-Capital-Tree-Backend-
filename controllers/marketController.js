// display the market price and trend
const axios = require('axios');
const MarketData = require('../models/MarketData');

//for ALPHA VINTAGE API key
const ALPHA_VANATGE_API_KEY = process.env.ALPHA_VANATGE_API_KEY;

//fetch the stoxk market data
exports.getStockPrice = async (req, res) =>{
    try{
        const{ symbol } = req.params;

        //fetch from Alpha vantage API
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const response = await axios.get(url);
        const data = response.data["Global Quote"];

        if (!data) return res.status(400).json({message: "Stock data not found"});

        //save to database
        const stcok = await MarketData.create({
            symbol: symbol.topUpperCase(),
            price: parseFloat(data["05. price"]),
            volume: parseInt(data["06. volume"]),
            timestamp: new Date()
        });

        res.json(stock);
        }catch(error){
            res.status(500).json({error: error.message});
        }
};