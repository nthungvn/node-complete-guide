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
      if (!post) {
        return res.status(404).json({
          message: 'No post found',
        });
      }
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

  if (!req.file) {
    return res.status(422).json({
      message: 'Validation failed, data input are incorrect',
      errors: {
        image: 'Image is required',
      },
    });
  }

  const imageUrl = req.file.path;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: {
      name: 'Hung',
    },
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

exports.updatePost = (req, res, next) => {
  const { postId } = req.params;
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

  Post.findOne({ _id: postId })
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          message: 'No post found',
        });
      }
      post.title = title;
      post.content = content;
      if (req.file) {
        post.imageUrl = req.file.path;
      }
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'OK',
        post: result,
      });
    })
    .catch((error) => next(error));
};
