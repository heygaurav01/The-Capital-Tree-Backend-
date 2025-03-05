const request = require('supertest');
require('./setupTest');

jest.setTimeout(10000); // Increase Jest timeout to 10 seconds

describe("Market Data API", () => {
    it("should fetch stock data successfully", async () => {
        const response = await request(global.agent).get('/api/market/TSLA');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('symbol', 'TSLA');
        expect(response.body).toHaveProperty('price');
        expect(response.body).toHaveProperty('volume');
    });

    it("should return 404 for invalid stock symbol", async () => {
        const response = await request(global.agent).get('/api/market/INVALID');
        expect(response.status).toBe(404);
    });
});
