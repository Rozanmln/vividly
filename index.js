const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app:startup');
const config = require('config');
const logger = require('./middleware/logger')
const authenticator = require('./middleware/authenticator')
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const home = require('./routes/home');
const func = require('joi/lib/types/func');

mongoose.connect('mongodb://127.0.0.1/vividly')
    .then(() => console.log('bisa connect'))
    .catch(err => console.error('gak bisa connect'));

// ADVANCE TOPIC EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/', home);


console.log(`app name: ${config.get('name')}`);
console.log(`mail name: ${config.get('mail.host')}`);
console.log(`password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    debug('lagi nge-dev');
}

app.use(logger);
app.use(authenticator);

// xxx

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`port ${port}`));