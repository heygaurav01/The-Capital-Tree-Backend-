const request = require('supertest');
const app = require('../server'); // Import Express server

describe("Market Data API", () => {
    it("should fetch stock data successfully", async () => {
        const response = await request(app).get('/api/market/TSLA');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('symbol', 'TSLA');
        expect(response.body).toHaveProperty('price');
        expect(response.body).toHaveProperty('volume');
    });

    it("should return 404 for invalid stock symbol", async () => {
        const response = await request(app).get('/api/market/INVALID');
        expect(response.status).toBe(404);
    });
});
