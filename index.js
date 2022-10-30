const express = require('express');
const config = require('config');
const logger = require('./logger')
const authenticator = require('./authenticator')
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const Joi = require('joi');
const func = require('joi/lib/types/func');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

console.log(`app name: ${config.get('name')}`);
console.log(`mail name: ${config.get('mail.host')}`);
console.log(`password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('morgan bisa');
}


app.use(logger);
app.use(authenticator);

const genres = [
    {id: 1, name: 'genre1'},
    {id: 2, name: 'genre2'},
    {id: 3, name: 'genre3'}
];

app.get('/', (req, res) => {
    res.send('Halaman Utaman Vividly');
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) res.status(404).send('gaada coursenya');
    res.send(genre);
});

app.post('/api/genres',  (req,res) => {
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

app.put('/api/genres/:id', (req, res) => {
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

app.delete('/api/genres/:id', (req, res) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`port ${port}`));