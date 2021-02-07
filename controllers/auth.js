const User = require('../models/user');

const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
  });
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const postLogin = (req, res, next) => {
  const { username, password } = req.body;
  User.findById('6006fc24e95f4b367ac6b10a')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((error) => {
        console.log(error);
        res.redirect('/');
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect('/');
  });
};

const getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isAuthenticated: false,
  });
};

const postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const user = new User({
    email: email,
    password: password,
    cart: { items: [] },
  });

  user
    .save()
    .then(() => {
      res.redirect('/login');
    })
    .catch((error) => console.log(error));
};

exports.getLogin = getLogin;
exports.postLogin = postLogin;
exports.postLogout = postLogout;
exports.getSignup = getSignup;
exports.postSignup = postSignup;
