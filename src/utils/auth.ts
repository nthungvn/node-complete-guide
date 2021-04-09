export const checkAuthenticate = (req) => {
  if (!req.isAuth) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
};
