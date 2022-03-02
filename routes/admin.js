const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middlewares/is-auth');
const adminAuth = require('../middlewares/admin-auth');
const adminController = require('../controllers/admin');

const User = require('../models/user');
const Product = require('../models/product');

const router = express.Router();

router.use(isAuth);
router.use(adminAuth);
router.get('/products', adminController.getProducts);

router.get('/product/:productId', adminController.getProduct);

//Visibility of the product can also be updated via this endpoint
router.put('/product',
    [
        body('productId')
            .custom((value, { req }) => {
                if (value) {
                    return Product.findOne({
                        where: {
                            id: req.body.productId
                        }
                    })
                        .then(product => {
                            if (!product) {
                                return Promise.reject('Invalid product id!');
                            }
                        })
                        .catch(error => Promise.reject("Error"));
                } else {
                    throw new Error('productId is required');
                }
            }),
        body('title')
            .isLength({ min: 3 }),
        body('price')
            .toFloat()
            .isFloat(),
        body('description')
            .isLength({ min: 5 }),
        body('isVisible')
            .toBoolean()
            .isBoolean()
    ]
    , adminController.updateProduct
);

router.delete('/product',
    [
        body('productId')
            .custom((value, { req }) => {
                if (value) {
                    return Product.findOne({
                        where: {
                            id: req.body.productId
                        }
                    })
                        .then(product => {
                            if (!product) {
                                return Promise.reject('Invalid product id!');
                            }
                        })
                        .catch(error => Promise.reject("Error"));
                } else {
                    throw new Error('productId is required');
                }
            })
    ]
    , adminController.deleteProduct
);

router.get('/users', adminController.getUsers);

router.get('/user/:userId', adminController.getUser);

router.put('/user',
    [
        body('userId')
            .custom((value, { req }) => {
                if (value) {
                    return User.findOne({
                        where: {
                            id: req.body.userId
                        }
                    })
                        .then(user => {
                            if (!user) {
                                return Promise.reject('Invalid user id!');
                            }
                        })
                        .catch(error => Promise.reject("Error"));
                } else {
                    throw new Error('userId is required');
                }
            }),
        body('username')
            .isLength({ min: 5 })
            .withMessage('Username should be minimum 5 characters long.'),
        body('name')
            .isLength({ min: 2 })
            .withMessage('Name should be minimum 2 characters long.'),
    ]
    , adminController.updateUser
);

router.delete('/user',
    [
        body('userId')
            .custom((value, { req }) => {
                if (value) {
                    return User.findOne({
                        where: {
                            id: req.body.userId
                        }
                    })
                        .then(user => {
                            if (!user) {
                                return Promise.reject('Invalid user id!');
                            }
                        })
                        .catch(error => Promise.reject("Error"));
                } else {
                    throw new Error('userId is required');
                }
            })
    ]
    , adminController.deleteUser
);

module.exports = router;