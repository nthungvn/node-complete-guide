const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const routes = express.Router();

routes.get('/login', authController.getLogin);
routes.post('/login', authController.postLogin);
routes.post('/logout', authController.postLogout);
routes.get('/signup', authController.getSignup);
routes.post(
  '/signup',
  [check('email').isEmail().withMessage('Please enter a valid email')],
  authController.postSignup,
);
routes.get('/reset', authController.getReset);
routes.post('/reset', authController.postReset);
routes.get('/reset/:resetToken', authController.getNewPassword);
routes.post('/new-password', authController.postNewPassword);

module.exports = routes;
