const mongoose = require('mongoose');
const express = require('express');
const {Genre, validate} = require('../models/genre');
const boolean = require('joi/lib/types/boolean');
const auth = require('../middleware/authenticator')
const router = express.Router();

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) res.status(404).send('gaada coursenya');
    res.send(genre);
});

router.post('/', auth, async (req,res) => {
    const { error } = validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const genre = new Genre({
        name: req.body.name
    });
    await genre.save();
    res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // cari course apakah ada
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    })

    if(!genre) return res.status(404).send('gaada coursenya');
    res.send(genre);
});

router.delete('/:id', auth, async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) return res.status(404).send('gaada coursenya');
    res.send(genre);
});

module.exports = router;