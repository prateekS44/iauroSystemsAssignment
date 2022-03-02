const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signupUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = {};
        error.statusCode = 422;
        error.message = "Invalid request";
        error.error = errors.array();
        return next(error);
    }
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const isAdmin = req.body.isAdmin;
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            return User.create({ username: username, password: hashedPassword, name: name, isAdmin: isAdmin });
        })
        .then(user => {
            res.status(201).json({ message: 'User created!', userId: user.id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.signinUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = {};
        error.statusCode = 422;
        error.message = "Invalid request";
        error.error = errors.array();
        return next(error);
    }
    const username = req.body.username;
    const password = req.body.password;
    let loadedUser;
    User.findAll({
        where: {
            username: username
        }
    })
        .then(users => {
            if (users.length == 0) {
                const error = {};
                error.statusCode = 401;
                error.message = "User with this username could not be found";
                throw error;
            } else if (users.length > 1) {
                const error = {};
                error.statusCode = 500;
                error.message = "Internal server error";
                throw error;
            }
            loadedUser = users[0];
            return bcrypt.compare(password, loadedUser.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    username: loadedUser.username,
                    userId: loadedUser.id,
                    isAdmin: loadedUser.isAdmin
                },
                process.env.J_SIGNATURE,
                { expiresIn: '1h' }
            );
            res.status(200).json({ token: token, userId: loadedUser.id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

