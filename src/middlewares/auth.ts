import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { CustomRequest } from '../utils/express-extended';

const handler: RequestHandler = async (req: CustomRequest, _, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const bearer = req.headers.authorization;
  if (!bearer) {
    req.isAuth = false;
    return next();
  }
  const token = bearer.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'my-secret') as { email: string };
    if (!decodedToken) {
      throw new Error();
    }
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  try {
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      req.isAuth = false;
      return next();
    }
    req.user = user;
    req.isAuth = true;
    next();
  } catch (error) {
    next(error);
  }
};
export default handler;
