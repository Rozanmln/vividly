const express = require('express');
const router = express.Router();

const genres = [
    {id: 1, name: 'genre1'},
    {id: 2, name: 'genre2'},
    {id: 3, name: 'genre3'}
];

router.get('/', (req, res) => {
    res.send(genres);
});

router.get('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) res.status(404).send('gaada coursenya');
    res.send(genre);
});

router.post('/',  (req,res) => {
    const { error } = validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const genre = {
        id: genres.length+1,
        name: req.body.name
    }
    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res) => {
    // cari course apakah ada
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('gaada coursenya');

    const { error } = validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('gaada coursenya');

    const index = genres.indexOf(genre);
    genres.splice(index,1);

    res.send(genre);
});


function validate(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}

module.exports = router;