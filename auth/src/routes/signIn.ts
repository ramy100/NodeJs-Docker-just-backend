import express, { Request, Response } from 'express';
import { validate } from '../middleware/validate';
import { User } from '../models/User';
import { loginValidationRules } from '../utils/inputValidation';

export const singInRouter = express.Router();

singInRouter.post(
  '/signin',
  loginValidationRules,
  validate,
  async (req: Request, res: Response) => {
    res.send('signin');
  }
);
