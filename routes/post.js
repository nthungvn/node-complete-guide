const { Router } = require('express');

const postController = require('../controllers/post');

const router = Router();

router.get('/posts', postController.getPosts);

router.post('/posts', postController.createPost);

module.exports = router;
