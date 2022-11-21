const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/',  async (req,res) => {
    const { error } = validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const customers = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customers.save();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customers = await Customer.findById(req.params.id);
    if(!customers) res.status(404).send('gaada customer nya');
    res.send(customers);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // cari cutomer apakah ada
    const customers = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {
        new: true
    })

    if(!customers) return res.status(404).send('gaada customernya');
    res.send(customers);
});

router.delete('/:id', async (req, res) => {
    const customers = await Customer.findByIdAndRemove(req.params.id);

    if(!customers) return res.status(404).send('gaada customernya');
    res.send(customers);
});

module.exports = router;