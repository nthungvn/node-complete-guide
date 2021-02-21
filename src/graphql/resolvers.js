const bcrypt = require('bcrypt');
const validator = require('validator').default;

const User = require('../models/user');

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

    if (!validator.isLength(password, { min: 5 } && !validator.isAlphanumeric(password))) {
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
};
