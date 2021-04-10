import { RequestHandler } from 'express';

export default () => {
  const handler: RequestHandler = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    if (req.method === 'OPTIONS') {
      return res.json();
    }
    next();
  };
  return handler;
};
