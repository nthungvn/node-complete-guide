const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = required('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  }
}))

const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: req.flash('errorMessage')[0],
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
        req.flash('errorMessage', 'Incorrect email or password');
        return res.redirect('/login');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          req.flash('errorMessage', 'Incorrect email or password');
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
      req.flash('errorMessage', 'Incorrect email or password');
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
    errorMessage: req.flash('errorMessage')[0],
  });
};

const postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash('errorMessage', 'The email already existed');
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
          return transporter
            .sendMail({
              from: 'node@shop.com',
              to: email,
              html: '<h1>Welcome to you Online shop</h1>',
            })
            .catch((error) => console.log(error));
        });
    })
    .catch((error) => console.log(error));
};

exports.getLogin = getLogin;
exports.postLogin = postLogin;
exports.postLogout = postLogout;
exports.getSignup = getSignup;
exports.postSignup = postSignup;
