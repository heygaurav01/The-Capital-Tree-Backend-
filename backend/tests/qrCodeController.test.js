const request = require('supertest');
const app = require('../server');

describe('QR Code Controller', () => {
    it('should generate QR code', async () => {
        const res = await request(app)
            .post('/api/qr/generate')
            .send({ amount: 100 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('qrCodeImage');
    });

    it('should return 400 if amount is missing', async () => {
        const res = await request(app)
            .post('/api/qr/generate')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Amount is required.');
    });
});