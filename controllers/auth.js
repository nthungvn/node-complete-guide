const getLogin = (req, res, next) => {
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
  res.setHeader('Set-Cookie', 'isLoggedIn=true; Max-Age=31536');
  res.redirect('/');
};

exports.getLogin = getLogin;
exports.postLogin = postLogin;
