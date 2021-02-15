const Router = require('express').Router;
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const router = Router();
router.post(
  '/signup',
  [
    body('name', 'Name required at least 4 characters')
      .trim()
      .escape()
      .isLength({ min: 4 }),
    body('email', 'Email is invalid').isEmail().normalizeEmail(),
    body(
      'password',
      'Password required at least 6 characters include number and character',
    )
      .trim()
      .escape()
      .isAlphanumeric(),
  ],
  authController.postSignup,
);
router.post(
  '/login',
  [
    body('email', 'Email is invalid').isEmail().normalizeEmail(),
    body(
      'password',
      'Password required at least 6 characters include number and character',
    )
      .trim()
      .escape()
      .isAlphanumeric(),
  ],
  authController.postLogin,
);

module.exports = router;
