const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  }),
);

const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: req.flash('errorMessage')[0],
    oldInput: { email: '', password: '' },
    validationErrors: [],
  });
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

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
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: [],
  });
};

const postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
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
      return transporter.sendMail({
        from: process.env.SENDGRID_SENDER,
        to: email,
        subject: 'Welcome',
        html: '<h1>Welcome to you Online shop</h1>',
      });
    })
    .catch((error) => console.log(error));
};

const getReset = (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset password',
    path: '/reset',
    errorMessage: req.flash('errorMessage')[0],
    oldInput: { email: '' },
    validationErrors: [],
  });
};

const postReset = (req, res, next) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/reset', {
      pageTitle: 'Reset password',
      path: '/reset',
      errorMessage: errors.array()[0].msg,
      oldInput: { email },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('errorMessage', 'This email was not available!');
        return res.redirect('/reset');
      }

      const resetToken = crypto.randomBytes(24).toString('hex');
      const resetExpirationDate = Date.now() + 60 * 60 * 1000;
      user.resetToken = resetToken;
      user.resetExpirationDate = resetExpirationDate;
      return user.save().then((result) => {
        res.redirect('/');
        return transporter.sendMail({
          from: process.env.SENDGRID_SENDER,
          to: email,
          subject: 'Reset your password request',
          html: `
          <h2>You're requesting to reset password</h2>
          <p>Please click to this <a href="http://localhost:3000/reset/${resetToken}">link</a> and finish within 60 minutes.</p>
        `,
        });
      });
    })
    .catch((error) => console.log(error));
};

const getNewPassword = (req, res, next) => {
  const { resetToken } = req.params;
  User.findOne({
    resetToken: resetToken,
    resetExpirationDate: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.redirect('/');
      }
      res.render('auth/new-password', {
        pageTitle: 'New password',
        path: '/reset',
        resetToken: resetToken,
        userId: user._id,
        errorMessage: req.flash('errorMessage')[0],
      });
    })
    .catch((error) => console.log(error));
};

const postNewPassword = (req, res, next) => {
  const { userId, resetToken, password, confirmPassword } = req.body;
  User.findOne({
    _id: userId,
    resetToken: resetToken,
    resetExpirationDate: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.redirect('/');
      }
      return bcrypt
        .hash(password, 12)
        .then((hashPassword) => {
          user.password = hashPassword;
          user.resetToken = undefined;
          user.resetExpirationDate = undefined;
          return user.save();
        })
        .then((result) => {
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
exports.getReset = getReset;
exports.postReset = postReset;
exports.getNewPassword = getNewPassword;
exports.postNewPassword = postNewPassword;
