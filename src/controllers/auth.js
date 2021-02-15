const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;

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
      res.status(200).json({
        message: 'OK',
        user: {
          name: result.name,
          email: result.email,
          token: 'result.password'
        },
      });
    })
    .catch((error) => next(error));
};
