import { checkAuthenticate } from '../utils/auth.js';

const getUser = async (_, req) => {
  checkAuthenticate(req);
  return {
    ...req.user._doc,
    _id: req.user._doc._id.toString(),
  };
};

const updateUserStatus = async ({ status }, req) => {
  checkAuthenticate(req);
  req.user.status = status;
  try {
    await req.user.save();
    return 'Status updated';
  } catch (error) {
    throw error;
  }
};

export { getUser, updateUserStatus };
