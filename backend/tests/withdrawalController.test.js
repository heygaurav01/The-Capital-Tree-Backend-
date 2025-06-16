const request = require('supertest');
const app = require('../server');
const { Withdrawal, User } = require('../models');

jest.mock('../models');

describe('Withdrawal API', () => {
    beforeEach(() => {
        User.findByPk.mockResolvedValue({ id: 1, kycCompleted: true });
        Withdrawal.create.mockResolvedValue({ id: 1, userId: 1, amount: 1000, bankDetails: 'test', status: 'pending' });
    });

    it('should allow user to request withdrawal', async () => {
        // Mock authentication middleware if needed
        const res = await request(app)
            .post('/api/withdrawals')
            .set('Authorization', 'Bearer testtoken') // You may need to mock authMiddleware
            .send({ amount: 1000, bankDetails: 'test' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Withdrawal request submitted');
    });
});