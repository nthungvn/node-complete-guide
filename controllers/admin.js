const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  req.user.getProducts().then((products) => {
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
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const { productId } = req.params;

  req.user
    .getProducts({
      where: {
        id: productId,
      },
    })
    .then((products) => {
      return products[0];
    })
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  Product.findByPk(productId)
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

  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      return products[0];
    })
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      res.redirect('/admin/products');
    });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  // req.user
  //   .createProduct({ title, imageUrl, price, description })
  Product.create({ title, imageUrl, price, description, userId: req.user.id })
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      console.log(error);
    });
};
