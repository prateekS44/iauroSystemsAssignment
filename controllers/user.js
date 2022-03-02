const Product = require('../models/product');

//User's getProduct(s) endpoint will only fetch the products where isVisible is set to true
exports.getProducts = (req, res, next) => {
    Product.findAll({
        where: {
            isVisible: true
        }
    })
    .then(products => {
        res.status(200).json({
            message: 'Fetched products successfully.',
            products: products,
            totalItems: products.length
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findOne({
        where: {
            id: productId,
            isVisible: true
        }
    })
    .then(product => {
        if(product != null) {
            return res.status(200).json({
                message: 'Fetched product successfully.',
                product: product
            });
        }
        return res.status(200).json({
            message: 'Fetched product successfully.No product found'
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.postProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const isVisible = true; //By default when the product is created, its isVisible property is set to true
    Product.create({ 
        title: title, 
        price: price, 
        description: description, 
        isVisible: isVisible 
    })
    .then(product => {
        res.status(201).json({ message: 'Product created!', productId: product.id });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}