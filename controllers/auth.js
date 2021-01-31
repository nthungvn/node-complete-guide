const getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.isLoggedIn,
  })
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const postLogin = (req, res, next) => {
  const {username, password} = req.body;
  console.log(username, password);
  req.session.isLoggedIn = true;
  res.redirect('/');
};

exports.getLogin = getLogin;
exports.postLogin = postLogin;
