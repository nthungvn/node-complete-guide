module.exports = () => {
  return (req, res, next) => {
    res.setHeader('Allow-Control-Access-Origin', '*');
    res.setHeader(
      'Allow-Control-Access-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );
    res.setHeader(
      'Allow-Control-Access-Headers',
      'Content-Type; Authorization',
    );
    next();
  };
};
