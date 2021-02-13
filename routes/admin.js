const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const authGuard = require('../middleware/authGuard');

const routes = express.Router();

// /admin/add-product => GET
routes.get('/add-product', authGuard, adminController.getAddProduct);
// /admin/add-product => POST
routes.post(
  '/add-product',
  authGuard,
  [
    body('title', 'Please enter a title').isLength({ min: 3 }).trim().escape(),
    body('price', 'Please enter price as a number').isFloat(),
    body('description', 'Please enter description')
      .isLength({ min: 5, max: 400 })
      .trim()
      .escape(),
  ],
  adminController.postAddProduct,
);
routes.get(
  '/edit-product/:productId',
  authGuard,
  adminController.getEditProduct,
);
routes.post(
  '/edit-product',
  authGuard,
  [
    body('title', 'Please enter a title').isLength({ min: 3 }).trim().escape(),
    body('price', 'Please enter price as a number').isFloat(),
    body('description', 'Please enter description')
      .isLength({ min: 5, max: 400 })
      .trim()
      .escape(),
  ],
  adminController.postEditProduct,
);
routes.post('/delete-product', authGuard, adminController.postDeleteProduct);

// /admin/products => GET
routes.get('/products', authGuard, adminController.getProducts);

module.exports = routes;
