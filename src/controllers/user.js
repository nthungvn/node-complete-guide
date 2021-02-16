const User = require('../models/user');

exports.getUserStatus = (req, res, next) => {
  res.status('200').json({ status: req.user.status });
};

exports.updateUserStatus = (req, res, next) => {
  const { status } = req.body;

  req.user.status = status;
  return req.user
    .save()
    .then((result) => {
      res.status('200').json({ message: 'Status updated' });
    })
    .catch((error) => next(error));
};
