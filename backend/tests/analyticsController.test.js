const request = require('supertest');
require('../setupTest');

jest.setTimeout(10000); // Increase Jest timeout to 10 seconds

describe("Analytics API", () => {
    it("should return user investment data", async () => {
        const response = await request(global.agent)
            .get('/api/analytics/investments')
            .set('Authorization', `Bearer ${userToken}`); // Replace with a valid user token

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('totalInvestments');
        expect(response.body).toHaveProperty('totalRevenue');
        expect(response.body).toHaveProperty('userActivity');
    });

    it("should return 401 for unauthorized access to investment data", async () => {
        const response = await request(global.agent).get('/api/analytics/investments');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Access Denied');
    });

    it("should return tracking data", async () => {
        const response = await request(global.agent)
            .get('/api/analytics/tracking')
            .set('Authorization', `Bearer ${adminToken}`); // Replace with a valid admin token

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should return 401 for unauthorized access to tracking data", async () => {
        const response = await request(global.agent).get('/api/analytics/tracking');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Access Denied');
    });
});
