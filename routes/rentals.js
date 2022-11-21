const {Rental, validate} = require('../models/rental');
const express = require('express');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const router = express.Router();

Fawn.init('mongodb://127.0.0.1/vividly');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/',  async (req,res) => {
    const { error } = validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('customer salah');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('movie salah');

    if (movie.numberInStock === 0) return res.status(400).send('gada stock movie');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalDate: customer.dailyRentalDate
        }
    });
    
    try {
        rental = await rental.save();
        movie.numberInStock--;
        movie.save();
        res.send(rental);
    }
    catch(ex) {
        res.status(500).send('ada yang salah');
    }
    

    // try {
    //     new Fawn.Task()
    //     .save('rentals', rental)
    //     .update('movies', {_id: movie._id}, {
    //         $inc: {numberInStock: -1}
    //     })
    //     .run();

    //     res.send(rental);
    // }
    // catch(ex) {
    //     res.status(500).send('ada yang salah');
    // }
    
});

router.get('/:id', async (req, res) => {
    const rentals = await Rental.findById(req.params.id);
    if(!rentals) res.status(404).send('gaada rental nya');
    res.send(rentals);
});

// router.put('/:id', async (req, res) => {
//     const { error } = validate(req.body);
//     if (error) {
//         return res.status(400).send(error.details[0].message);
//     }

//     const customer = await Customer.findById(req.body.customerId);
//     if (!customer) return res.status(400).send('customer salah');

//     const movie = await Movie.findById(req.body.movieId);
//     if (!movie) return res.status(400).send('movie salah');

//     // cari movie
//     const rentals = await Rental.findByIdAndUpdate(req.params.id, {
//         customer: {
//             _id: customer._id,
//             name: customer.name,
//             phone: customer.phone
//         },
//         movie: {
//             _id: movie._id,
//             title: customer.title,
//             dailyRentalDate: customer.dailyRentalDate
//         }
//     }, {
//         new: true
//     });

//     if(!rentals) return res.status(404).send('gaada rental');
//     res.send(rentals);
// });

router.delete('/:id', async (req, res) => {
    const rentals = await Rental.findByIdAndRemove(req.params.id);

    if(!rentals) return res.status(404).send('gaada movie');
    res.send(rentals);
});

module.exports = router;