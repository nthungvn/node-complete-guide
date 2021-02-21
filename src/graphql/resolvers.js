const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = {
  createUser: async ({ userInput }, req) => {
    const { name, email, password } = userInput;

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
