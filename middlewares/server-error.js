module.exports = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (statusCode === 500) {
    console.log(error);
  }

  res.status(statusCode).json({
    message: error.message,
    error: error,
  });
};
