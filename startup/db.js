const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect('mongodb://127.0.0.1/vividly', {useUnifiedTopology:true})
    .then(() => winston.info('bisa connect'));
}