const {User} = require('../../../models/user');
const authorize = require('../../../middleware/authorize');
const mongoose = require('mongoose');

describe('auth middleware', () => {
    it('populate req.user ke payload yang valid json token', () => {
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();

        authorize(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});