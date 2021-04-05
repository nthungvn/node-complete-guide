const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator').default;

const User = require('../models/user');

exports.postSignup = async ({ userInput }, req) => {
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
};

exports.postLogin = async (args, _) => {
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
};
