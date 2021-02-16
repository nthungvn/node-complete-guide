const jwt = require('jsonwebtoken');
const User = require('../models/user');
/**
 *
 * @param {import("express").Request} req
 * @param {*} res
 * @param {*} next
 */
module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const bearer = req.headers.authorization;
  if (!bearer) {
    throwUnauthenticated();
  }
  const token = bearer.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'my-secret');
    if (!decodedToken) {
      throw new Error();
    }
  } catch (err) {
    throwUnauthenticated();
  }
  try {
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      throwUnauthenticated();
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const throwUnauthenticated = () => {
  const error = new Error('Not Authenticated');
  error.statusCode = 401;
  throw error;
};
