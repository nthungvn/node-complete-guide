const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Order = require('../models/order');
const Product = require('../models/product');
const { deleteFile } = require('../utils/file');

const ITEMS_PER_PAGE = 3;

exports.getIndex = (req, res) => {
  const page = +req.query.page || 1;

  let totalProducts;

  Product.countDocuments()
    .then((numProducts) => {
      totalProducts = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasPreviousPage: page - 1 > 0,
        previousPage: Math.max(page - 1, 1),
        hasNextPage: page * ITEMS_PER_PAGE < totalProducts,
        nextPage: Math.min(page + 1, Math.ceil(totalProducts / ITEMS_PER_PAGE)),
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch((error) => {
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
    });
};

exports.getProducts = (req, res) => {
  const page = +req.query.page || 1;

  let totalProducts;

  Product.countDocuments()
    .then((numProducts) => {
      totalProducts = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Your Products',
        path: '/products',
        currentPage: page,
        hasPreviousPage: page - 1 > 0,
        previousPage: Math.max(page - 1, 1),
        hasNextPage: page * ITEMS_PER_PAGE < totalProducts,
        nextPage: Math.min(page + 1, Math.ceil(totalProducts / ITEMS_PER_PAGE)),
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
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
  req.user
    .getCart()
    .then((products) => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products,
      });
    })
    .catch((error) => {
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
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

exports.getCheckout = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      const totalPrice = products.reduce((previousValue, currentProduct) => {
        return currentProduct.productId.price * currentProduct.quantity;
      }, 0);

      res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        products: products,
        totalPrice: totalPrice,
      });
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
  Order.findOne({ _id: orderId, userId: req.user._id }).then((order) => {
    if (!order) {
      return res.redirect('/404');
    }
    const invoiceName = `invoice-${orderId}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);

    const invoicePath = path.resolve('data', 'invoices', invoiceName);
    const invoicePdf = new PDFDocument();
    const invoiceStream = fs.createWriteStream(invoicePath);
    invoicePdf.pipe(invoiceStream);
    invoicePdf.pipe(res);
    invoicePdf.fontSize(24).text('Invoice - ' + orderId);
    invoicePdf.fontSize(16);
    invoicePdf.text('---------------------------');
    let total = 0;
    order.products.forEach((product) => {
      total += product.price * product.quantity;
      invoicePdf.text(
        `${product.title}: ${product.quantity} - ${product.price}$`,
      );
    });
    invoicePdf.text('---------------------------');
    invoicePdf.fontSize(24).text(`Total: ${total}$`);
    invoicePdf.end();
    invoiceStream.end('finish', () => {
      setTimeout(() => {
        deleteFile(invoicePath);
      }, 30_000);
    });
  });
};
