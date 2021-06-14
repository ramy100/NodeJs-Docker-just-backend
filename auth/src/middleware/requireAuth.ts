import { RequestHandler } from 'express';
import { UnAuthorizedError } from '../errors/UnauthorizedError';

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.currentUser) return next();
  return next(new UnAuthorizedError());
};
