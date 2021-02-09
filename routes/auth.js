const express = require('express');
const authController = require('../controllers/auth');

const routes = express.Router();

routes.get('/login', authController.getLogin);
routes.post('/login', authController.postLogin);
routes.post('/logout', authController.postLogout);
routes.get('/signup', authController.getSignup);
routes.post('/signup', authController.postSignup);
routes.get('/reset', authController.getReset);
routes.post('/reset', authController.postReset);

module.exports = routes;
