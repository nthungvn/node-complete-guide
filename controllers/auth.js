const getLogin = (req, res, next) => {
  console.log(req.get('Cookie'));
  req.isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';
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
