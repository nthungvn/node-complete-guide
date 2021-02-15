const Router = require('express').Router;

const authController = require('../controllers/auth');

const router = Router();
router.post('/signup', authController.postSignup);
router.post('/login', authController.postLogin);

module.exports = router;
