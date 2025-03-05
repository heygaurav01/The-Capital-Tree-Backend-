const request = require('supertest');
const app = require('../server');
const { Blog } = require('../models');

jest.mock('../models');

describe('Blog API Tests', () => {
    beforeEach(() => {
        Blog.findAll.mockResolvedValue([
            { id: 1, title: "Stock Market Trends", content: "Market analysis...", author: "Admin" }
        ]);
        Blog.create.mockResolvedValue({
            id: 2, title: "Investment Tips", content: "How to invest wisely...", author: "John Doe"
        });
    });

    test('✅ Should fetch all blogs', async () => {
        const res = await request(app).get('/api/blogs');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('✅ Should create a blog', async () => {
        const res = await request(app)
            .post('/api/blogs')
            .send({
                title: "Investment Tips",
                content: "How to invest wisely...",
                author: "John Doe"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("title", "Investment Tips");
    });
});
