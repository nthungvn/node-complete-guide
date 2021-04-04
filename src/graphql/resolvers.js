const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validator = require('validator').default;

const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
  createUser: async ({ userInput }, req) => {
    const { name, email, password } = userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push('Please enter correct email!');
    }
    if (validator.isEmpty(name)) {
      errors.push('Your name is missing');
    }

    if (
      !validator.isLength(
        password,
        { min: 5 } && !validator.isAlphanumeric(password),
      )
    ) {
      errors.push('Password need at least 5 characters and Alphanumeric');
    }

    if (errors.length > 0) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors;
      throw error;
    }

    try {
      const user = await User.findOne({ email: email });
      if (user) {
        const error = new Error('User existed');
        error.statusCode = 409;
        throw error;
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        name: name,
        email: email,
        password: hashPassword,
      });
      const result = await newUser.save();
      return {
        ...result._doc,
        _id: result._id,
      };
    } catch (error) {
      throw error;
    }
  },

  login: async (args, _) => {
    const { email, password } = args;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push('Please enter correct email!');
    }
    if (
      !validator.isLength(
        password,
        { min: 5 } && !validator.isAlphanumeric(password),
      )
    ) {
      errors.push('Password need at least 5 characters and Alphanumeric');
    }

    if (errors.length > 0) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors;
      throw error;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('Not-existed user');
      error.statusCode = 401;
      throw error;
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      const error = new Error('User or password was wrong');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      'my-secret',
      {
        issuer: 'Self',
        expiresIn: '1h',
      },
    );
    return {
      userId: user._id,
      token: token,
    };
  },

  createPost: async ({ postInput }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

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

    // if (!req.file) {
    //   const error = new Error('Validation failed, Image is required');
    //   error.statusCode = 422;
    //   throw error;
    // }

    // const imageUrl = req.file.path;

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
  },

  getPosts: async (args, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const page = args.page || 1;
    const ITEMS_PER_PAGE = 3;
    try {
      const totalItems = await Post.countDocuments();
      const posts = await Post.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .populate('creator', 'name email')
        .sort({ createdAt: -1 });

      return {
        posts: posts.map((post => ({
          ...post._doc,
          _id: post._id.toString(),
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        }))),
        totalPosts: totalItems,
      };
    } catch (error) {
      throw error;
      next(error);
    }
  },
};
