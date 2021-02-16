const Router = require('express').Router;

const userController = require('../controllers/user');

const router = new Router();

router.get('/status', userController.getUserStatus);
router.patch('/status', userController.updateUserStatus);;

module.exports = router;
