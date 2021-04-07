const { validationResult } = require('express-validator');

const Post = require('../models/post');
const { deleteFile } = require('../utils/file');
const { throwNotFound } = require('../utils/error');

const ITEMS_PER_PAGE = 3;

exports.getPosts = async (req, res, next) => {
  const page = req.query.page || 1;
  try {
    const totalItems = await Post.countDocuments();
    const posts = await Post.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate('creator', 'name email');

    res.status(200).json({
      message: 'OK',
      totalItems: totalItems,
      posts: posts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findOne({ _id: postId }).populate(
      'creator',
      'name email',
    );
    if (!post) {
      throwNotFound('No post found');
    }
    res.status(200).json({
      message: 'OK',
      post: post,
    });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
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

  try {
    const result = await post.save();
    req.user.posts.push(post);
    await req.user.save();
    res.status(200).json({
      message: 'OK',
      post: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
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

  try {
    const post = await Post.findOne({ _id: postId, creator: req.user });
    if (!post) {
      throwNotFound('No post found');
    }
    post.title = title;
    post.content = content;
    if (req.file) {
      deleteFile(post.imageUrl);
      post.imageUrl = req.file.path;
    }
    const result = await post.save();
    res.status(200).json({
      message: 'OK',
      post: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findOne({ _id: postId, creator: req.user._id });
    if (!post) {
      throwNotFound('No post found');
    }
    await Promise.all([deleteFile(post.imageUrl), post.remove()]);
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};
