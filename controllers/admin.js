const Product = require('../models/product');
const User = require('../models/user');

//Admin's getProduct(s) endpoints are different 
//because in these endpoints the products which are not visible will also be sent 
exports.getProducts = (req, res, next) => {
    Product.findAll()
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
            message: 'Fetched product successfully.No product found with the given id'
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getUsers = (req, res, next) => {
    User.findAll({
        attributes: [['id', 'userId'], 'name', 'username', 'isAdmin', 'createdAt', 'updatedAt']
    })
    .then(users => {
        res.status(200).json({
            message: 'Fetched users successfully.',
            users: users,
            totalItems: users.length
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
    User.findOne({
        where: {
            id: userId
        },
        attributes: [['id', 'userId'], 'name', 'username', 'isAdmin', 'createdAt', 'updatedAt']
    })
    .then(user => {
        if(user != null) {
            return res.status(200).json({
                message: 'Fetched user successfully.',
                user: user
            });
        }
        return res.status(200).json({
            message: 'Fetched user successfully.No user found with the given id'
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.updateProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedVisibilty = req.body.isVisible;

    Product.update({ 
        title: updatedTitle, 
        price: updatedPrice, 
        description: updatedDescription, 
        isVisible: updatedVisibilty 
    }, {
        where: {
            id: productId
        }
    })
    .then(result => {
        res.status(200).json({ message: 'Product updated!'});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.body.productId;

    Product.destroy({
        where: {
            id: productId
        }
    })
    .then(result => {
        res.status(200).json({ message: 'Product deleted!'});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updateUser = (req, res, next) => {
    const userId = req.body.userId;
    const updatedUsername = req.body.username;
    const updatedName = req.body.name;

    User.update({ 
        username: updatedUsername, 
        name: updatedName
    }, {
        where: {
            id: userId
        }
    })
    .then(result => {
        res.status(200).json({ message: 'User updated!'});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.deleteUser = (req, res, next) => {
    const userId = req.body.userId;

    User.destroy({
        where: {
            id: userId
        }
    })
    .then(result => {
        res.status(200).json({ message: 'User deleted!'});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}