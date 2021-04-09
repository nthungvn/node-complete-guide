export const throwNotFound = (message) => {
  const error = new Error(message || 'No found');
  error.statusCode = 404;
  throw error;
};
