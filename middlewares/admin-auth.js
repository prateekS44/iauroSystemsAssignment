module.exports = (req, res, next) => {
    if(!req.auth) {
        const error = {};
        error.statusCode = 401;
        error.message = 'Not authenticated.';
        return next(error);
    } 
    if(!req.isAdmin) {
        const error = {};
        error.statusCode = 403;
        error.message = 'Forbidden';
        return next(error);
    }
    return next();
}