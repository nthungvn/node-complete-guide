
const {checkAuthenticate} = require('../utils/auth');

exports.getUser = async (_, req) => {
  checkAuthenticate(req);
  return {
    ...req.user._doc,
    _id: req.user._doc._id.toString()
  };
};

exports.updateUserStatus = async ({ status }, req) => {
  checkAuthenticate(req);
  req.user.status = status;
  try {
    await req.user.save();
    return 'Status updated';
  } catch (error) {
    throw error;
  }
};
