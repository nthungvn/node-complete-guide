const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: 'OK',
        posts: posts,
      });
    })
    .catch((error) => next(error));
};

exports.getSinglePost = (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((post) => {
      res.status(200).json({
        message: 'OK',
        post: post,
      });
    })
    .catch((error) => next(error));
};

exports.createPost = (req, res, next) => {
  const { title, content } = req.body;

  const errors = validationResult(req);

  const errorMessages = {};
  errors.array().forEach((error) => (errorMessages[error.param] = error.msg));

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, data input are incorrect',
      errors: errorMessages,
    });
  }

  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'http://localhost:8080/uploads/nokia-72-black-600x600.jpg',
    creator: {
      name: 'Hung',
    },
    createdAt: new Date(),
  });

  post
    .save()
    .then((result) => {
      res.status(200).json({
        message: 'OK',
        post: result,
      });
    })
    .catch((error) => next(error));
};
