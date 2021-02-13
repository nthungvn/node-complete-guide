const fs = require('fs');
const path = require('path');

const Order = require('../models/order');
const Product = require('../models/product');

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
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
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
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
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
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
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
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
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
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
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
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch((error) => {
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
    });
};

/**
 * @param {import('express-serve-static-core').Request} req
 * @param {import('express-serve-static-core').Response} res
 * @param {*} next
 */
exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  Order.findOne({ _id: orderId, userId: req.session.user._id }).then(
    (order) => {
      if (order) {
        return res.redirect('/404');
      }
      const invoicePath = path.resolve(
        'data',
        'invoices',
        `invoice-${orderId}.pdf`,
      );
      const invoiceFile = fs.createReadStream(invoicePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=invoice-${orderId}.pdf`);
      invoiceFile.pipe(res);
    },
  );
};
