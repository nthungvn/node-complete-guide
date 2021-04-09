export default (error, _, res, __) => {
  const statusCode = error.statusCode || 500;

  if (statusCode === 500) {
    console.log(error);
  }

  res.status(statusCode).json({
    message: error.message,
    data: error.data,
  });
};
