const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((error) => {
      res.redirect('/500');
    });
};

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Your Products',
        path: '/products',
      });
    })
    .catch((error) => {
      res.redirect('/500');
    });
};

/**
 *
 * @param {import('express-serve-static-core').Request} req
 * @param {*} res
 * @param {*} next
 */
exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product,
      });
    })
    .catch((error) => {
      res.redirect('/500');
    });
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((products) => {
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
      products: products,
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((error) => {
      res.redirect('/500');
    });
};

exports.postDeleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeOutCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch((error) => {
      res.redirect('/500');
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.session.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders,
      });
    })
    .catch((error) => {
      res.redirect('/500');
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch((error) => {
      res.redirect('/500');
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
