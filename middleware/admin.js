
function isAdmin(req, res, next) {
    if(!req.user.isAdmin) return res.status(403).send('akses gabisa');
    next();
}

module.exports = isAdmin;