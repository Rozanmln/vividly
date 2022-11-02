const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title : 'ini vividly rojan', message : 'haloha'});
});

module.exports = router;