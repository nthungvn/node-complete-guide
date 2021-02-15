const { validationResult } = require('express-validator');
const Post = require('../models/post');
const { deleteFile } = require('../utils/file');

const ITEMS_PER_PAGE = 3;

exports.getPosts = (req, res, next) => {
  const page = req.query.page || 1;
  let totalItems = 0;

  Post.countDocuments({ creator: req.user })
    .then((count) => {
      totalItems = count;
      return Post.find({ creator: req.user })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((posts) => {
      res.status(200).json({
        message: 'OK',
        totalItems: totalItems,
        posts: posts,
      });
    })
    .catch((error) => next(error));
};

exports.getPost = (req, res, next) => {
  const { postId } = req.params;

  Post.findOne({ _id: postId, creator: req.user })
    .populate('creator', 'name email')
    .then((post) => {
      if (!post) {
        const error = new Error('No post found');
        error.statusCode = 404;
        throw error;
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

  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => (errorMessages[error.param] = error.msg));
    const error = new Error('Validation failed, data input are incorrect');
    error.data = errorMessages;
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error('Validation failed, Image is required');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.user,
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
  const { title, content, image } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => (errorMessages[error.param] = error.msg));
    const error = new Error('Validation failed, data input are incorrect');
    error.data = errorMessages;
    error.statusCode = 422;
    throw error;
  }

  Post.findOne({ _id: postId, creator: req.user })
    .then((post) => {
      if (!post) {
        const error = new Error('No post found');
        error.statusCode = 404;
        throw error;
      }
      post.title = title;
      post.content = content;
      if (req.file) {
        deleteFile(post.imageUrl);
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

exports.deletePost = (req, res, next) => {
  const { postId } = req.params;

  Post.findOne({ _id: postId, creator: req.user._id })
    .then((post) => {
      if (!post) {
        const error = new Error('No post found');
        error.statusCode = 404;
        throw error;
      }
      return Promise.all([deleteFile(post.imageUrl), post.remove()]);
    })
    .then((result) => {
      res.status(200).json({ message: 'Post deleted' });
    })
    .catch((error) => next(error));
};
