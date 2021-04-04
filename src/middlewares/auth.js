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
    req.isAuth = false;
    return next();
  }
  const token = bearer.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'my-secret');
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
