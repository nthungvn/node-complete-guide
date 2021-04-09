import { default as validator } from 'validator';
import Post from '../models/post.js';
import { deleteFile } from '../utils/file.js';
import { throwNotFound } from '../utils/error.js';
import { checkAuthenticate } from '../utils/auth.js';

const getPosts = async (args, req) => {
  checkAuthenticate(req);
  const page = args.page || 1;
  const ITEMS_PER_PAGE = 2;
  try {
    const totalItems = await Post.countDocuments();
    const posts = await Post.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });

    return {
      posts: posts.map((post) => ({
        ...post._doc,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      })),
      totalPosts: totalItems,
    };
  } catch (error) {
    throw error;
  }
};

const getPost = async ({ postId }, req) => {
  checkAuthenticate(req);
  try {
    const post = await Post.findOne({ _id: postId }).populate(
      'creator',
      'name email',
    );
    if (!post) {
      throwNotFound('No post found');
    }
    return {
      _id: post._id.toString(),
      ...post._doc,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  } catch (error) {
    throw error;
  }
};

const createPost = async ({ postInput }, req) => {
  checkAuthenticate(req);
  const { title, content, imageUrl } = postInput;

  const errors = [];

  if (!validator.isLength(title, { min: 5 })) {
    errors.push('Content need at least 5 characters');
  }

  if (!validator.isLength(content, { min: 5 })) {
    errors.push('Content need at least 5 characters');
  }

  if (errors.length > 0) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors;
    throw error;
  }

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.user,
  });

  try {
    const result = await post.save();
    req.user.posts.push(result);
    await req.user.save();
    return {
      ...result._doc,
      _id: result._id.toString(),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  } catch (error) {
    throw error;
  }
};

const updatePost = async ({ postId, postInput }, req) => {
  checkAuthenticate(req);
  const { title, content, imageUrl } = postInput;

  const errors = [];

  if (!validator.isLength(title, { min: 5 })) {
    errors.push('Content need at least 5 characters');
  }

  if (!validator.isLength(content, { min: 5 })) {
    errors.push('Content need at least 5 characters');
  }

  if (errors.length > 0) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors;
    throw error;
  }

  try {
    const post = await Post.findOne({ _id: postId, creator: req.user });
    if (!post) {
      throwNotFound('No post found');
    }
    post.title = title;
    post.content = content;
    if (imageUrl !== 'undefined') {
      post.imageUrl = imageUrl;
    }

    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
      creator: req.user,
    };
  } catch (error) {
    throw error;
  }
};

const deletePost = async ({ postId }, req) => {
  checkAuthenticate(req);
  try {
    const post = await Post.findOne({ _id: postId, creator: req.user._id });
    if (!post) {
      throwNotFound('No post found');
    }
    req.user.posts.pull(post._id);
    await Promise.all([deleteFile(post.imageUrl), post.remove()]).catch(
      (error) => console.log(error),
      req.user.save(),
    );
    return 'Post deleted';
  } catch (error) {
    throw error;
  }
};

export { getPosts, getPost, createPost, updatePost, deletePost };
