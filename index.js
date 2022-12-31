const express = require('express');
const app = express();
const winston = require('winston');
const home = require('./routes/home');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

// ADVANCE TOPIC EXPRESS
app.use('/', home);

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`port ${port}`));