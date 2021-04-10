import { Response } from "express";
import { CustomError } from "../utils/error";

export default (error: CustomError, _: any, res: Response, __: any) => {
  const statusCode = error.statusCode || 500;

  if (statusCode === 500) {
    console.log(error);
  }

  res.status(statusCode).json({
    message: error.message,
    data: error.data,
  });
};
