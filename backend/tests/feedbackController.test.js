const request = require('supertest');
const app = require('../server');
const { Feedback } = require('../models');

jest.mock('../models');

describe('Feedback Controller', () => {
    beforeEach(() => {
        Feedback.create.mockResolvedValue({ id: 1, userId: 1, rating: 5, comment: "Great!" });
        Feedback.findAll.mockResolvedValue([{ id: 1, userId: 1, rating: 5, comment: "Great!" }]);
    });

    it('should submit feedback', async () => {
        // Mock auth middleware if needed
        const res = await request(app)
            .post('/api/feedback')
            .set('Authorization', 'Bearer testtoken')
            .send({ rating: 5, comment: "Great!" });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Feedback submitted successfully');
    });

    it('should get all feedbacks', async () => {
        const res = await request(app)
            .get('/api/feedback')
            .set('Authorization', 'Bearer admintoken');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});