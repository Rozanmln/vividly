const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
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

        it('eror kalo gada id nya', async () => {
            const res = await request(server).get('/api/genres/2');

            expect(res.status).toBe(404);
        });

        it('eror kalo gada genre yang idnya diinput', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const exec = async () => {
            return await request(server).post('/api/genres').set('x-auth-token', token).send({name});
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'action';
        })

        it('return 401 kalo user blum login', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('return 400 kalo genrenya kurang dari 5 char', async () => {
            name = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('return 400 kalo genrenya lebih dari 50 char', async () => {
            name = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('return save genre kalo valid inputnya', async () => {
            const res = await exec();

            const genre = await Genre.find({name: 'action'});
            expect(genre).not.toBeNull();
        });

        it('return genrenya kalo valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'action');
        });

        
    });
});