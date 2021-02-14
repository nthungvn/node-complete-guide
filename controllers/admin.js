const { validationResult } = require('express-validator');

const Product = require('../models/product');
const { deleteFile } = require('../utils/file');

const ITEMS_PER_PAGE = 3;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;

  let totalProducts;

  Product.countDocuments()
    .then((numProducts) => {
      totalProducts = numProducts;
      return Product.find({ userId: req.user._id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Shop',
        path: '/admin/products',
        currentPage: page,
        hasPreviousPage: page - 1 > 0,
        previousPage: Math.max(page - 1, 1),
        hasNextPage: page * ITEMS_PER_PAGE < totalProducts,
        nextPage: Math.min(page + 1, Math.ceil(totalProducts / ITEMS_PER_PAGE)),
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
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

  if (!req.file) {
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

  const imageUrl = req.file.path;
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
      if (req.file) {
        deleteFile(product.imageUrl);
        product.imageUrl = req.file.path;
      }
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

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findOne({ _id: productId, userId: req.user._id.toString() })
    .then((product) => {
      if (!product) {
        return next(new Error('Product not found'));
      }
      deleteFile(product.imageUrl);
      return product.remove();
    })
    .then((result) => {
      res.json({ message: 'Product deleted' });
    })
    .catch((error) => {
      res.json({ message: 'Deleting product failed' });
    });
};
