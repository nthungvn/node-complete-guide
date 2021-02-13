const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password', 'Please enter a valid password')
      .isLength({ min: 6 })
      .isAlphanumeric(),
  ],
  authController.postLogin,
);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((email) => {
        return User.findOne({ email: email }).then((user) => {
          if (user) {
            return Promise.reject('The email already existed');
          }
          return true;
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password at least 6 characters and Alphanumeric',
    )
      .isLength({ min: 6 })
      .isAlphanumeric(),
    body('confirmPassword').custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error('Confirm password has to match');
      }
      return true;
    }),
  ],
  authController.postSignup,
);
router.get('/reset', authController.getReset);
router.post(
  '/reset',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
  ],
  authController.postReset,
);
router.get('/reset/:resetToken', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
