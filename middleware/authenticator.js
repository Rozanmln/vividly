const jwt = require('jsonwebtoken');
const config = require('config');

function authenticate(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('akses ditolak. gaada token');

    try {
        const decode = jwt.verify(token, config.get('jwtPrivatekey'));
        req.user = decode;
        next(); 
    }
    catch(ex) {
        res.status(400).send('token salah');
    }
}

module.exports = authenticate;