import { NextFunction, Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { RequestValitaionError } from '../errors/requestValidation';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();
  if (hasErrors) return next(new RequestValitaionError(result.array()));
  const data = matchedData(req);
  req.body = data;
  next();
};
