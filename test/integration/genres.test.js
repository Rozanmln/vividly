const request = require('supertest');
const {Genre} = require('../../models/genre');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => {server = require('../../index'); })
    afterEach(async () => {
        server.close(); 
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('return genre yang ada', async () => {
            await Genre.collection.insertMany([
                {name: 'horor'},
                {name: 'komedi'}
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'horor')).toBeTruthy();
            expect(res.body.some(g => g.name === 'komedi')).toBeTruthy();
        });
    });

    describe('GET /id', () => {
        it('return genre pake id nya', async () => {
            const genre = new Genre({name: 'action'});
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });
    });
});