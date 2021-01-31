const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login'
  })
};

const postLogin = (req, res, next) => {
  const {username, password} = req.body;
  console.log(username, password);
  res.json({ message: 'OK' });
};

exports.getLogin = getLogin;
exports.postLogin = postLogin;
