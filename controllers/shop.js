const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(([products, _]) => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Your Products',
        path: '/products',
      });
    })
    .catch((error) => {
      console.error(error);
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
  Product.findById(productId, (product) => {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/products',
      product: product,
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProductsData = [];
      for (let cartProduct of cart.products) {
        const existingProduct = products.find(
          (product) => product.id === cartProduct.id,
        );
        if (existingProduct) {
          cartProductsData.push({
            productData: existingProduct,
            quantity: cartProduct.quantity,
          });
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        cartProductsData: cartProductsData,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postDeleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.removeProduct(productId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
