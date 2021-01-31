const User = require("../models/user");

const getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const postLogin = (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  User.findById('6006fc24e95f4b367ac6b10a')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogin = getLogin;
exports.postLogin = postLogin;
