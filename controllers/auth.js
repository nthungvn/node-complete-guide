const User = require('../models/user');
const bcrypt = require('bcryptjs');

const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  });
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect('/login');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res.redirect('/login');
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((error) => {
          if (error) {
            console.log(error);
            return res.redirect('/login');
          }
          res.redirect('/');
        });
      });
    })
    .catch((err) => {
      return res.redirect('/login');
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    }
    res.redirect('/');
  });
};

const getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
  });
};

const postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.redirect('/signup');
      }
      bcrypt
        .genSalt()
        .then((salted) => {
          return bcrypt.hash(password, salted);
        })
        .then((hashPassword) => {
          const user = new User({
            email,
            password: hashPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          res.redirect('/login');
        });
    })
    .catch((error) => console.log(error));
};

exports.getLogin = getLogin;
exports.postLogin = postLogin;
exports.postLogout = postLogout;
exports.getSignup = getSignup;
exports.postSignup = postSignup;
