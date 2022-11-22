const {Movie, validate} = require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');
const { Genre } = require('../models/genre');
const auth = require('../middleware/authorize')
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.post('/', auth,  async (req,res) => {
    const { error } = validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('genre salah');

    const movies = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalDate: req.body.dailyRentalDate
    });
    await movies.save();
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movies = await Movie.findById(req.params.id);
    if(!movies) res.status(404).send('gaada movie nya');
    res.send(movies);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('genre salah');

    // cari movie
    const movies = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalDate: req.body.dailyRentalDate
    }, {
        new: true
    });

    if(!movies) return res.status(404).send('gaada movienya');
    res.send(movies);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const movies = await Movie.findByIdAndRemove(req.params.id);

    if(!movies) return res.status(404).send('gaada movie');
    res.send(movies);
});

module.exports = router;