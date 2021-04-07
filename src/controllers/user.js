const User = require('../models/user');

exports.getUserStatus = (req, res, next) => {
  res.status(200).json({ status: req.user.status });
};

exports.updateUserStatus = async (req, res, next) => {
  const { status } = req.body;

  req.user.status = status;
  try {
    await req.user.save();
    res.status(200).json({ message: 'Status updated' });
  } catch (error) {
    next(error);
  }
};
