const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const authGuard = require('../middleware/authGuard');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', authGuard, adminController.getAddProduct);
// /admin/add-product => POST
router.post(
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
router.get(
  '/edit-product/:productId',
  authGuard,
  adminController.getEditProduct,
);
router.post(
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
router.delete('/products/:productId', authGuard, adminController.deleteProduct);

// /admin/products => GET
router.get('/products', authGuard, adminController.getProducts);

module.exports = router;
