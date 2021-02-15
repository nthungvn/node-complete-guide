const Router = require('express').Router;

const authController = require('../controllers/auth');

const router = Router();
router.post('/signup', authController.signup);

module.exports = router;
