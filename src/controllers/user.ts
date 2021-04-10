import { checkAuthenticate } from '../utils/auth.js';
import { CustomRequest } from '../utils/express-extended.js';

const getUser = async (_: any, req: CustomRequest) => {
  checkAuthenticate(req);
  return {
    ...req.user?._doc,
    _id: req.user?._doc._id.toString(),
  };
};

const updateUserStatus = async (args: {status: string}, req: CustomRequest) => {
  checkAuthenticate(req);
  if (req.user) {
    req.user.status = args.status;
  }
  try {
    await req.user?.save();
    return 'Status updated';
  } catch (error) {
    throw error;
  }
};

export { getUser, updateUserStatus };
