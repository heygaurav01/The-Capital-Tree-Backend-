const app = require('./server');
const http = require('http');
const request = require('supertest');

let server;

beforeAll((done) => {
    server = http.createServer(app);
    server.listen(4000, () => {
        global.agent = request.agent(server);
        done();
    });
});

afterAll((done) => {
    server.close(done);
});