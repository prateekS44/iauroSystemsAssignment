const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = {};
        error.statusCode = 401;
        error.message = 'Not authenticated.';
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.J_SIGNATURE);
    } catch (err) {
        if(err.message === 'jwt expired' || err.message === 'jwt malformed') {
            const error = {};
            error.statusCode = 401;
            error.message = 'Invalid token';
            return next(error);
        }
        const error = {};
        error.statusCode = 500;
        return next(error);
    }
    if (!decodedToken) {
        const error = {};
        error.statusCode = 401;
        error.message = 'Not authenticated.';
        return next(error);
    }
    User.count({
        where: {
            id: decodedToken.userId
        }
    })
    .then(count => {
        if(count != 1) {
            const error = {};
            error.statusCode = 401;
            error.message = 'Invalid token';
            return next(error);
        }
        req.auth = true;
        req.userId = decodedToken.userId;
        req.isAdmin = decodedToken.isAdmin;
        return next();
    })
    .catch(err => {
        const error = {};
        error.statusCode = 500;
        return next(error);
    })
};