const request = require('supertest');
const app = require('../server');

describe("Transaction API", () => {
    it("should create a new transaction", async () => {
        const response = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${userToken}`) // Replace with a valid user token
            .send({
                userId: 1, // Replace with a valid user ID
                planId: 1, // Replace with a valid plan ID
                amount: 100.0
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('userId', 1);
        expect(response.body).toHaveProperty('planId', 1);
        expect(response.body).toHaveProperty('amount', 100.0);
        expect(response.body).toHaveProperty('status', 'pending');
    });

    it("should get all transactions", async () => {
        const response = await request(app)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${adminToken}`); // Replace with a valid admin token

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});