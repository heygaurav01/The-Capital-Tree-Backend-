const axios = require('axios');
const MarketData = require('../models/MarketData');

// Get API key from environment variables
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Get current stock quote
exports.getStockPrice = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ message: "Symbol parameter is required" });
        }

        // Fetch from Alpha Vantage API - Global Quote endpoint
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        console.log(`Fetching quote for: ${symbol}`);
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'request' }
        });
        
        const data = response.data["Global Quote"];
        
        // Check if data is available
        if (!data || Object.keys(data).length === 0) {
            return res.status(404).json({ message: "Stock data not found" });
        }

        // Save to database using only the fields in your existing schema
        const stock = await MarketData.create({
            symbol: symbol.toUpperCase(),
            price: parseFloat(data["05. price"]),
            volume: parseInt(data["06. volume"]),
            timestamp: new Date()
        });
        
        // Return response with all data, even if some isn't stored in DB
        res.json({
            symbol: stock.symbol,
            price: stock.price,
            change: data["09. change"],
            changePercent: data["10. change percent"],
            volume: stock.volume,
            timestamp: stock.timestamp,
            open: data["02. open"],
            high: data["03. high"],
            low: data["04. low"],
            latestTradingDay: data["07. latest trading day"],
            previousClose: data["08. previous close"]
        });
    } catch (error) {
        console.error("Error fetching stock price:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get quote endpoint
exports.getQuote = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ message: "Symbol parameter is required" });
        }

        // Fetch from Alpha Vantage API - QUOTE endpoint
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'request' }
        });
        
        const data = response.data["Global Quote"];
        
        if (!data || Object.keys(data).length === 0) {
            return res.status(404).json({ message: "Quote data not found" });
        }
        
        // Format response
        const formattedData = {
            symbol: data["01. symbol"],
            open: parseFloat(data["02. open"]),
            high: parseFloat(data["03. high"]),
            low: parseFloat(data["04. low"]),
            price: parseFloat(data["05. price"]),
            volume: parseInt(data["06. volume"]),
            latestTradingDay: data["07. latest trading day"],
            previousClose: parseFloat(data["08. previous close"]),
            change: parseFloat(data["09. change"]),
            changePercent: data["10. change percent"]
        };
        
        res.json(formattedData);
    } catch (error) {
        console.error("Error fetching quote data:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get intraday data
exports.getIntradayData = async (req, res) => {
    try {
        const { symbol, interval = '5min' } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ message: "Symbol parameter is required" });
        }
        
        // Valid intervals: 1min, 5min, 15min, 30min, 60min
        const validIntervals = ['1min', '5min', '15min', '30min', '60min'];
        if (!validIntervals.includes(interval)) {
            return res.status(400).json({ 
                message: "Invalid interval. Valid options are: 1min, 5min, 15min, 30min, 60min" 
            });
        }

        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'request' }
        });
        
        const metaData = response.data["Meta Data"];
        const timeSeries = response.data[`Time Series (${interval})`];
        
        if (!timeSeries || Object.keys(timeSeries).length === 0) {
            return res.status(404).json({ message: "Intraday data not found" });
        }
        
        // Format data for response
        const formattedData = Object.keys(timeSeries).map(timestamp => {
            const dataPoint = timeSeries[timestamp];
            return {
                timestamp,
                open: parseFloat(dataPoint["1. open"]),
                high: parseFloat(dataPoint["2. high"]),
                low: parseFloat(dataPoint["3. low"]),
                close: parseFloat(dataPoint["4. close"]),
                volume: parseInt(dataPoint["5. volume"])
            };
        });
        
        res.json({
            metaData,
            data: formattedData
        });
    } catch (error) {
        console.error("Error fetching intraday data:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get daily time series
exports.getDailyData = async (req, res) => {
    try {
        const { symbol, outputsize = 'compact' } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ message: "Symbol parameter is required" });
        }
        
        // outputsize can be 'compact' (latest 100 datapoints) or 'full' (up to 20 years of data)
        if (outputsize !== 'compact' && outputsize !== 'full') {
            return res.status(400).json({ 
                message: "Invalid outputsize. Valid options are: compact, full" 
            });
        }

        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputsize}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'request' }
        });
        
        const metaData = response.data["Meta Data"];
        const timeSeries = response.data["Time Series (Daily)"];
        
        if (!timeSeries || Object.keys(timeSeries).length === 0) {
            return res.status(404).json({ message: "Daily data not found" });
        }
        
        // Format data for response
        const formattedData = Object.keys(timeSeries).map(date => {
            const dataPoint = timeSeries[date];
            return {
                date,
                open: parseFloat(dataPoint["1. open"]),
                high: parseFloat(dataPoint["2. high"]),
                low: parseFloat(dataPoint["3. low"]),
                close: parseFloat(dataPoint["4. close"]),
                volume: parseInt(dataPoint["5. volume"])
            };
        });
        
        res.json({
            metaData,
            data: formattedData
        });
    } catch (error) {
        console.error("Error fetching daily data:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get daily adjusted time series
exports.getDailyAdjustedData = async (req, res) => {
    try {
        const { symbol, outputsize = 'compact' } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ message: "Symbol parameter is required" });
        }
        
        // outputsize can be 'compact' (latest 100 datapoints) or 'full' (up to 20 years of data)
        if (outputsize !== 'compact' && outputsize !== 'full') {
            return res.status(400).json({ 
                message: "Invalid outputsize. Valid options are: compact, full" 
            });
        }

        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=${outputsize}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'request' }
        });
        
        const metaData = response.data["Meta Data"];
        const timeSeries = response.data["Time Series (Daily)"];
        
        if (!timeSeries || Object.keys(timeSeries).length === 0) {
            return res.status(404).json({ message: "Daily adjusted data not found" });
        }
        
        // Format data for response
        const formattedData = Object.keys(timeSeries).map(date => {
            const dataPoint = timeSeries[date];
            return {
                date,
                open: parseFloat(dataPoint["1. open"]),
                high: parseFloat(dataPoint["2. high"]),
                low: parseFloat(dataPoint["3. low"]),
                close: parseFloat(dataPoint["4. close"]),
                adjustedClose: parseFloat(dataPoint["5. adjusted close"]),
                volume: parseInt(dataPoint["6. volume"]),
                dividendAmount: parseFloat(dataPoint["7. dividend amount"]),
                splitCoefficient: parseFloat(dataPoint["8. split coefficient"])
            };
        });
        
        res.json({
            metaData,
            data: formattedData
        });
    } catch (error) {
        console.error("Error fetching daily adjusted data:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get weekly time series
exports.getWeeklyData = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ message: "Symbol parameter is required" });
        }

        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'request' }
        });
        
        const metaData = response.data["Meta Data"];
        const timeSeries = response.data["Weekly Time Series"];
        
        if (!timeSeries || Object.keys(timeSeries).length === 0) {
            return res.status(404).json({ message: "Weekly data not found" });
        }
        
        // Format data for response
        const formattedData = Object.keys(timeSeries).map(date => {
            const dataPoint = timeSeries[date];
            return {
                date,
                open: parseFloat(dataPoint["1. open"]),
                high: parseFloat(dataPoint["2. high"]),
                low: parseFloat(dataPoint["3. low"]),
                close: parseFloat(dataPoint["4. close"]),
                volume: parseInt(dataPoint["5. volume"])
            };
        });
        
        res.json({
            metaData,
            data: formattedData
        });
    } catch (error) {
        console.error("Error fetching weekly data:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get weekly adjusted time series
exports.getWeeklyAdjustedData = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ message: "Symbol parameter is required" });
        }

        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'request' }
        });
        
        const metaData = response.data["Meta Data"];
        const timeSeries = response.data["Weekly Adjusted Time Series"];
        
        if (!timeSeries || Object.keys(timeSeries).length === 0) {
            return res.status(404).json({ message: "Weekly adjusted data not found" });
        }
        
        // Format data for response
        const formattedData = Object.keys(timeSeries).map(date => {
            const dataPoint = timeSeries[date];
            return {
                date,
                open: parseFloat(dataPoint["1. open"]),
                high: parseFloat(dataPoint["2. high"]),
                low: parseFloat(dataPoint["3. low"]),
                close: parseFloat(dataPoint["4. close"]),
                adjustedClose: parseFloat(dataPoint["5. adjusted close"]),
                volume: parseInt(dataPoint["6. volume"]),
                dividendAmount: parseFloat(dataPoint["7. dividend amount"])
            };
        });
        
        res.json({
            metaData,
            data: formattedData
        });
    } catch (error) {
        console.error("Error fetching weekly adjusted data:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get monthly time series
exports.getMonthlyData = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ message: "Symbol parameter is required" });
        }

        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'request' }
        });
        
        const metaData = response.data["Meta Data"];
        const timeSeries = response.data["Monthly Time Series"];
        
        if (!timeSeries || Object.keys(timeSeries).length === 0) {
            return res.status(404).json({ message: "Monthly data not found" });
        }
        
        // Format data for response
        const formattedData = Object.keys(timeSeries).map(date => {
            const dataPoint = timeSeries[date];
            return {
                date,
                open: parseFloat(dataPoint["1. open"]),
                high: parseFloat(dataPoint["2. high"]),
                low: parseFloat(dataPoint["3. low"]),
                close: parseFloat(dataPoint["4. close"]),
                volume: parseInt(dataPoint["5. volume"])
            };
        });
        
        res.json({
            metaData,
            data: formattedData
        });
    } catch (error) {
        console.error("Error fetching monthly data:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get monthly adjusted time series
exports.getMonthlyAdjustedData = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ message: "Symbol parameter is required" });
        }

        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'request' }
        });
        
        const metaData = response.data["Meta Data"];
        const timeSeries = response.data["Monthly Adjusted Time Series"];
        
        if (!timeSeries || Object.keys(timeSeries).length === 0) {
            return res.status(404).json({ message: "Monthly adjusted data not found" });
        }
        
        // Format data for response
        const formattedData = Object.keys(timeSeries).map(date => {
            const dataPoint = timeSeries[date];
            return {
                date,
                open: parseFloat(dataPoint["1. open"]),
                high: parseFloat(dataPoint["2. high"]),
                low: parseFloat(dataPoint["3. low"]),
                close: parseFloat(dataPoint["4. close"]),
                adjustedClose: parseFloat(dataPoint["5. adjusted close"]),
                volume: parseInt(dataPoint["6. volume"]),
                dividendAmount: parseFloat(dataPoint["7. dividend amount"])
            };
        });
        
        res.json({
            metaData,
            data: formattedData
        });
    } catch (error) {
        console.error("Error fetching monthly adjusted data:", error.message);
        res.status(500).json({ error: error.message });
    }
};