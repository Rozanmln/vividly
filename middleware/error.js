const winston = require('winston');

function error(err, req, res, next) {
    //log exception
    winston.error(err.message, err);
    res.status(500).send('ada yang gagal');
}

module.exports = error;