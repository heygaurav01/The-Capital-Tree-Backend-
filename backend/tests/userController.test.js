const request = require('supertest');
const { User } = require('../models/User');
require('../setupTest');

jest.setTimeout(10000); // Increase Jest timeout to 10 seconds

describe("User API", () => {
    it("should register a new user", async () => {
        const response = await request(global.agent)
            .post('/api/users/register')
            .send({
                name: "Test User",
                email: "testuser@example.com",
                password: "password123",
                role: "user"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('name', 'Test User');
        expect(response.body.user).toHaveProperty('email', 'testuser@example.com');
    });

    it("should login a user", async () => {
        const response = await request(global.agent)
            .post('/api/users/login')
            .send({
                email: "testuser@example.com",
                password: "password123"
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('message', 'Logged in successfully');
    });

    it("should get all users (admin only)", async () => {
        const response = await request(global.agent)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`); // Replace with a valid admin token

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});