const config = require('config');

module.exports = function() {
    if(!config.get('jwtPrivatekey')) {
        throw new Error('fatal eror: jwt private key tidak ada');
    }
}