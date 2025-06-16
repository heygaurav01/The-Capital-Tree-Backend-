const request = require('supertest');
const app = require('../server');
const { Notification } = require('../models');

jest.mock('../models');

describe('Notification Controller', () => {
    beforeEach(() => {
        Notification.create.mockResolvedValue({ id: 1, userId: 1, title: "Test", message: "Msg", status: "sent" });
        Notification.findAll.mockResolvedValue([{ id: 1, userId: 1, title: "Test", message: "Msg", status: "sent" }]);
    });

    it('should get all notifications', async () => {
        const res = await request(app).get('/api/notifications');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});