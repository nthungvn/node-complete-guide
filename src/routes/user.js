const Router = require('express').Router;

const userController = require('../controllers/user');

const router = new Router();

router.get('/:userId/status', userController.getUserStatus);
router.put('/:userId/status', userController.updateUserStatus);;

module.exports = router;
