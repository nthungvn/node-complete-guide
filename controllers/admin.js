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
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const { productId } = req.params;

  Product.findById(productId).then((product) => {
    if (!product) {
      return res.redirect('/');
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  Product.findById(productId)
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
      console.log(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByIdAndDelete(productId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  Product.create({ title, imageUrl, price, description, userId: req.session.user })
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      console.log(error);
    });
};
