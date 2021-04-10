import { CustomError } from "./error";
import { CustomRequest } from "./express-extended";

export const checkAuthenticate = (req: CustomRequest) => {
  if (!req.isAuth) {
    const error: CustomError = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
};
1
