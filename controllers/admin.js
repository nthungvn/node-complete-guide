const { validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.find({
    userId: {
      $eq: req.session.user._id,
    },
  })
    .exec()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Shop',
        path: '/admin/products',
      });
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: undefined,
    hasError: false,
    product: { title: '', price: '', description: '' },
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: errors.array()[0].msg,
      hasError: true,
      product: { title, price, description },
      validationErrors: errors.array(),
    });
  }

  const imageUrl = req.file && req.file.path;
  if (!imageUrl) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: 'Please choose the image',
      hasError: true,
      product: { title, price, description },
      validationErrors: [],
    });
  }

  Product.create({
    title,
    imageUrl,
    price,
    description,
    userId: req.session.user,
  })
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const { productId } = req.params;

  Product.findOne({ _id: productId, userId: req.user._id.toString() }).then(
    (product) => {
      if (!product) {
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage: undefined,
        hasError: false,
        validationErrors: [],
      });
    },
  );
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      errorMessage: errors.array()[0].msg,
      hasError: true,
      product: { _id: productId, title, price, description },
      validationErrors: errors.array(),
    });
  }

  Product.findOne({ _id: productId, userId: req.user._id.toString() })
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;

      return product.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.deleteOne({ _id: productId, userId: req.user._id.toString() })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      const errorNext = new Error(error);
      errorNext.httpStatusCode = 500;
      next(errorNext);
    });
};
