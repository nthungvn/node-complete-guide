const express = require('express');
const authController = require('../controllers/auth');
const csrfToken = require('../middleware/csrfToken');

const routes = express.Router();

routes.get('/login', csrfToken, authController.getLogin);
routes.post('/login', authController.postLogin);
routes.post('/logout', authController.postLogout);
routes.get('/signup', csrfToken, authController.getSignup);
routes.post('/signup', authController.postSignup);

module.exports = routes;
