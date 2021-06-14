import { RequestHandler } from 'express';
import { UserPayload } from '../models/User';
import { JwtManager } from '../services/jwt';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | null;
    }
  }
}

export const currentUser: RequestHandler = (req, res, next) => {
  const result = JwtManager.verify(req.session?.jwt);
  req.currentUser = result;
  next();
};
