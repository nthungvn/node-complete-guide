const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.postSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);

  const errorMessage = {};
  errors.array().forEach((error) => (errorMessage[error.param] = error.msg));

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.validation = errorMessage;
    throw error;
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        const error = new Error('User existed');
        error.statusCode = 409;
        throw error;
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashPassword) => {
      const newUser = new User({
        name: name,
        email: email,
        password: hashPassword,
      });
      return newUser.save();
    })
    .then((result) => {
      const token = jwt.sign({ email: result.email }, 'my-secret', {
        issuer: 'Self',
        expiresIn: '3m',
      });

      res.status(200).json({
        message: 'OK',
        user: {
          name: result.name,
          email: result.email,
          token: token,
        },
      });
    })
    .catch((error) => next(error));
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  let fetchedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      fetchedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((doMatch) => {
      if (!doMatch) {
        const error = new Error('User or password was wrong');
        error.statusCode = 401;
        throw error;
      }
      return jwt.sign({ email: fetchedUser.email }, 'my-secret', {
        issuer: 'Self',
        expiresIn: '3m',
      });
    })
    .then((token) => {
      res.status(200).json({
        message: 'OK',
        user: {
          email: email,
          token: token,
        },
      });
    })
    .catch((error) => next(error));
};
