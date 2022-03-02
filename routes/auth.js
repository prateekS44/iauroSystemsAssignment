const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.post('/signup',
    [
        body('username')
            .isLength({ min: 5 })
            .withMessage('Username should be minimum 5 characters long.')
            .custom((value, { req }) => {
                if (value) {
                    return User.findOne({
                        where: {
                            username: req.body.username
                        }
                    })
                        .then(user => {
                            if (user) {
                                return Promise.reject('Username already exists!');
                            }
                        })
                        .catch(error => Promise.reject("Error"));
                } else {
                    throw new Error('Username is required');
                }
            }),
        body('password')
            .isLength({ min: 5 })
            .withMessage('Password should be minimum 5 characters long.'),
        body('name')
            .isLength({ min: 2 })
            .withMessage('Name should be minimum 2 characters long.'),
        body('isAdmin')
            .toBoolean()
            .isBoolean()
            .withMessage('isAdmin property only accepts boolean')
            .custom((value, { req }) => {
                return User.findOne({
                    where: {
                        isAdmin: true
                    }
                })
                    .then(user => {
                        if (value === true && user) { //If isAdmin field is true and an admin already exists
                            return Promise.reject('Admin account has already been created');
                        }
                    })
                    .catch(error => Promise.reject("Error"));
            })
    ],
    authController.signupUser
);

router.post('/signin',
    [
        body('username')
            .notEmpty()
            .withMessage('Username cannot be empty'),
        body('password')
            .notEmpty()
            .withMessage('Password cannot be empty'),
    ]
    , authController.signinUser
);

module.exports = router;