const request = require('supertest');
const app = require('../server'); // Import your Express app
const { User } = require('../models');
const bcrypt = require('bcryptjs');

jest.mock('../models'); // Mock Sequelize model

describe('User API Tests', () => {
    let user;

    beforeEach(async () => {
        user = {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            password: await bcrypt.hash("Test@123", 10),
            phone: "+919876543210",
            role: "user",
            isPhoneVerified: true,
            isEmailVerified: true
        };
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(user);
    });

    test(' Should register a user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: "John Doe",
                email: "john@example.com",
                phone: "+919876543210",
                password: "Test@123",
                confirmPassword: "Test@123",
                role: "user"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "User registered. Verify phone & email.");
    });

    test(' Should return error if passwords do not match', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: "John Doe",
                email: "john@example.com",
                phone: "+919876543210",
                password: "Test@123",
                confirmPassword: "WrongPass@123",
                role: "user"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Passwords do not match");
    });
});
