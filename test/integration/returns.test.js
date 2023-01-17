const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const moment = require('moment');
const request = require('supertest');
const { Movie } = require('../../models/movie');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    const exec = () => {
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});
    };

    beforeEach(async () => {
        server = require('../../index'); 
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: 'ini judul pelm',
            dailyRentalRate: 2,
            genre: {name: '12345'},
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'ini judul pelm',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach(async () => {
        await server.close(); 
        await Rental.remove({});
        await Movie.remove({});
    });

    it('reuturn 401', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('reuturn 400 customerid gaada', async () => {
        customerId = '';

        const res = await exec();
    
        expect(res.status).toBe(400);
    });

    it('reuturn 400 movie id gaada', async () => {
        movieId = '';
        
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('reuturn 404 kalo gada rental ayng ditemukan', async () => {
        await Rental.remove({});
        
        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('reuturn 400 kalo gada rental nya udh ada', async () => {
        rental.dateReturn = new Date();
        await rental.save();
        
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('reuturn 200 kalo valid req nya', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('set return date kalo valid', async () => {
        const res = await exec();
        
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturn;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('kalkulasi rental fee nya', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        
        const res = await exec();
        
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });
    
    it('increase movie stock', async () => {
        const res = await exec();
        
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('Return rentalnya kalo bener inputnya', async () => {
        const res = await exec();
        
        const rentalInDb = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturn', 'rentalFee', 'customer', 'movie'])
        );
    });
})
