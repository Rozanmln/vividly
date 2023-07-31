const express = require('express');
const app = express();
const winston = require('winston');
const home = require('./routes/home');
const expressLayouts = require('express-ejs-layouts');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

// ADVANCE TOPIC EXPRESS
app.use('/', home);
app.use(expressLayouts);
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
// const server = app.listen(port, () => winston.info(`port ${port}`));
app.listen(port, () => console.log(`listen to port ${port}`));
// module.exports = server;