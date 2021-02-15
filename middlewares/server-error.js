module.exports = (error, req, res, next) => {
  console.log(error);

  res.status(error.httpStatusCode || 500).json({
    message: 'Unexpected error',
    error: error,
  });
};
