const { Router } = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');

const router = Router();

router.get('/posts', feedController.getPosts);

router.get('/posts/:postId', feedController.getPost);

router.post(
  '/posts',
  [
    body('title', 'Please enter the title at least 5 characters long')
      .trim()
      .isLength({ min: 5 })
      .escape(),
    body('content', 'Please enter the content at least 5 characters long')
      .trim()
      .isLength({ min: 5 })
      .escape(),
  ],
  feedController.createPost,
);

router.put(
  '/posts/:postId',
  [
    body('title', 'Please enter the title at least 5 characters long')
      .trim()
      .isLength({ min: 5 })
      .escape(),
    body('content', 'Please enter the content at least 5 characters long')
      .trim()
      .isLength({ min: 5 })
      .escape(),
  ],
  feedController.updatePost,
);

router.delete('/posts/:postId', feedController.deletePost);

module.exports = router;
