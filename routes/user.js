const express = require('express');
const { body, param } = require('express-validator');

const isAuth = require('../middlewares/is-auth');
const userAuth = require('../middlewares/user-auth');
const userController = require('../controllers/user');

const Product = require('../models/product');

const router = express.Router();

router.use(isAuth);
router.use(userAuth);
router.get('/products', userController.getProducts);

router.get('/product/:productId',
    [
        param('productId')
            .notEmpty()
            .withMessage('Product id cannot be empty')
            .custom((value, { req }) => {
                if (value) {
                    return Product.findOne({
                        where: {
                            id: req.params.productId
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
    , userController.getProduct
);

router.post('/product',
    [
        body('title')
            .isLength({ min: 3 })
            .withMessage('Title cannot be less than 3 characters'),
        body('price')
            .toFloat()
            .isFloat(),
        body('description')
            .isLength({ min: 5 })
            .withMessage('Description cannot be less than 5 characters')
    ],
    userController.postProduct
);

module.exports = router;