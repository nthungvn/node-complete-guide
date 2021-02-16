const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const { throwNotFound } = require('../utils/error');

exports.postSignup = async (req, res, next) => {
  const errors = validationResult(req);

  const errorMessage = {};
  errors.array().forEach((error) => (errorMessage[error.param] = error.msg));

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errorMessage;
    throw error;
  }

  const { name, email, password } = req.body;

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
    res.status(201).json({
      message: 'User created',
      userId: result._id,
      email: result.email,
    });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throwNotFound('User not found');
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
    res.status(200).json({
      message: 'OK',
      userId: user._id,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};
