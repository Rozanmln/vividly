const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const request = require('supertest');
let server;

describe('auth middleware', () => {
    beforeEach(() => {server = require('../../index'); })
    afterEach(async () => {
        await Genre.remove({});
        await server.close(); 
    });

    let token;

    const exec = () => {
        return request(server).post('/api/genres').set('x-auth-token', token).send({name: 'action'});
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    })

    it('return 401 kalo gada tokennya', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('return 400 kalo invalid token', async () => {
        token = 'a';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('return 200 kalo token valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});