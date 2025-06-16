const request = require('supertest');
const app = require('../server');
const { FAQ } = require('../models');

jest.mock('../models');

describe('FAQ Controller', () => {
    beforeEach(() => {
        FAQ.create.mockResolvedValue({ id: 1, question: "Q?", answer: "A" });
        FAQ.findAll.mockResolvedValue([{ id: 1, question: "Q?", answer: "A" }]);
        FAQ.findByPk.mockResolvedValue({ id: 1, question: "Q?", answer: "A", save: jest.fn(), destroy: jest.fn() });
    });

    it('should create FAQ', async () => {
        const res = await request(app)
            .post('/api/faqs')
            .send({ question: "Q?", answer: "A" });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('question', "Q?");
    });

    it('should get all FAQs', async () => {
        const res = await request(app).get('/api/faqs');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get FAQ by id', async () => {
        const res = await request(app).get('/api/faqs/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
    });

    it('should update FAQ', async () => {
        const res = await request(app)
            .put('/api/faqs/1')
            .send({ question: "Q2?", answer: "A2" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('question', "Q2?");
    });

    it('should delete FAQ', async () => {
        const res = await request(app).delete('/api/faqs/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'FAQ deleted successfully');
    });
});