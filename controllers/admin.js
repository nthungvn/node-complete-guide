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
    product: { title: '', imageUrl: '', price: '', description: '' },
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: errors.array()[0].msg,
      hasError: true,
      product: { title, imageUrl, price, description },
      validationErrors: errors.array(),
    });
  }

  Product.create({
    _id: new ObjectId('600448c0e97e7e096f4408e7'),
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
      res.redirect('/500');
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
  const { productId, title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      errorMessage: errors.array()[0].msg,
      hasError: true,
      product: { _id: productId, title, imageUrl, price, description },
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
      res.redirect('/500');
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.deleteOne({ _id: productId, userId: req.user._id.toString() })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      res.redirect('/500');
    });
};
