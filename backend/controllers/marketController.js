// display the market price and trend
const axios = require('axios');
const MarketData = require('../models/MarketData');

//for ALPHA VINTAGE API key
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
console.log("ALPHA_VANTAGE_API_KEY:", ALPHA_VANTAGE_API_KEY);

//fetch the stoxk market data
exports.getStockPrice = async (req, res) =>{
    try{
        const{ symbol } = req.params;

        //fetch from Alpha vantage API
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=XS5DEVAR24EWUTZU`;
        console.log(url);
        const response = await axios.get(url);
        console.log(response.data);
        const data = response.data["Global Quote"];
        console.log(data);
        //check if data is available

        if (!data) return res.status(400).json({message: "Stock data not found"});

        //save to database
        const stcok = await MarketData.create({
            
            symbol: symbol.topUpperCase(),
            price: parseFloat(data["05. price"]),
            volume: parseInt(data["06. volume"]),
            timestamp: new Date()
        });console.log(stock);

        res.json(stock);
        }catch(error){console.log(error);
            res.status(500).json({error: error.message});
        }
};