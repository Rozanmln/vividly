require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app:startup');
const config = require('config');
const winston = require('winston');
require('winston-mongodb');
const logger = require('./middleware/logger')
const error = require('./middleware/error');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const func = require('joi/lib/types/func');

mongoose.connect('mongodb://127.0.0.1/vividly', {useUnifiedTopology:true})
    .then(() => console.log('bisa connect'))
    .catch(err => console.error('gak bisa connect'));

winston.add(new winston.transports.File({filename: 'logfile.log'}));
winston.add(new winston.transports.MongoDB({db: 'mongodb://127.0.0.1/vividly'}));

// ADVANCE TOPIC EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);
app.use(error);


console.log(`app name: ${config.get('name')}`);
console.log(`mail name: ${config.get('mail.host')}`);
if(!config.get('jwtPrivatekey')) {
    console.error('fatal eror: jwt private key tidak ada');
    process.exit(1);
}

if (app.get('env') === 'development') {
    debug('lagi nge-dev');
}

app.use(logger);
// xxx

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`port ${port}`));