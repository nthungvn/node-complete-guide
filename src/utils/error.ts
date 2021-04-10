export type CustomError =  {
  statusCode?: number;
  data?: any,
} & Error;

export const throwNotFound = (message: string) => {
  const error: CustomError = new Error(message || 'No found');
  error.statusCode = 404;
  throw error;
};
