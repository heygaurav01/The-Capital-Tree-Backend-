const request = require('supertest');
const app = require('../server');

describe("Plan API", () => {
    it("should create a new plan (admin only)", async () => {
        const response = await request(app)
            .post('/api/plans')
            .set('Authorization', `Bearer ${adminToken}`) // Replace with a valid admin token
            .send({
                name: "Test Plan",
                description: "This is a test plan",
                price: 100.0
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name', 'Test Plan');
        expect(response.body).toHaveProperty('description', 'This is a test plan');
        expect(response.body).toHaveProperty('price', 100.0);
    });

    it("should get all plans", async () => {
        const response = await request(app).get('/api/plans');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should update a plan (admin only)", async () => {
        const response = await request(app)
            .put('/api/plans/1') // Replace with a valid plan ID
            .set('Authorization', `Bearer ${adminToken}`) // Replace with a valid admin token
            .send({
                name: "Updated Plan",
                description: "This is an updated plan",
                price: 150.0
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Plan updated successfully');
    });

    it("should delete a plan (admin only)", async () => {
        const response = await request(app)
            .delete('/api/plans/1') // Replace with a valid plan ID
            .set('Authorization', `Bearer ${adminToken}`); // Replace with a valid admin token

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Plan deleted successfully');
    });
});