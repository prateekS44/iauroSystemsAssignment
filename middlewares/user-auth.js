module.exports = (req, res, next) => {
    if(!req.auth) {
        const error = {};
        error.statusCode = 401;
        error.message = 'Not authenticated.';
        return next(error);
    }
    return next();
}