const request = require('supertest');
const app = require('../server');

describe("Prediction API", () => {
    it("should return a valid stock price prediction", async () => {
        const response = await request(app).get('/api/prediction/TSLA');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('symbol', 'TSLA');
        expect(response.body).toHaveProperty('predictedPrice');
        expect(response.body).toHaveProperty('confidence');
    });

    it("should return 404 for an invalid stock symbol", async () => {
        const response = await request(app).get('/api/prediction/INVALID');
        expect(response.status).toBe(404);
    });
});
