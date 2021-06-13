import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValitaionError } from '../errors/requestValidation';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();
  if (hasErrors) throw new RequestValitaionError(result.array());
  next();
};
