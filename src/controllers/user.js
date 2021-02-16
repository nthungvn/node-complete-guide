const User = require('../models/user');

exports.getUserStatus = (req, res, next) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      res.status('200').json({ status: user.status });
    })
    .catch((error) => next(error));
};

exports.updateUserStatus = (req, res, next) => {
  const { userId } = req.params;
  const { status } = req.body;
  User
    .findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      user.status = status;
      return user.save();
    })
    .then((result) => {
      res.status('200').json({
        message: 'Status updated',
        status: result.status,
      });
    })
    .catch((error) => next(error));
};
