exports.getNotFound = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '',
  });
};

exports.get500 = (err, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Server Error',
    path: '/500',
  });
};
