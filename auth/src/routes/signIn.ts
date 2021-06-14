import express, { NextFunction, Request, Response } from 'express';
import { validate } from '../middleware/validate';
import { User } from '../models/User';
import { loginValidationRules } from '../utils/inputValidation';
import { BadRequestError } from '../errors/BadRequestError';
import { PasswordManager } from '../services/password';
import { JwtManager } from '../services/jwt';
export const singInRouter = express.Router();

singInRouter.post(
  '/signin',
  loginValidationRules,
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser)
        return next(new BadRequestError('invalid credentials'));
      const validPassword = await PasswordManager.compare(
        existingUser.password,
        password
      );
      if (!validPassword)
        return next(new BadRequestError('invalid credentials'));
      const token = JwtManager.sign(existingUser);
      req.session = {
        jwt: token,
      };
      res.status(201).json('welcome ' + existingUser.email);
    } catch (error) {
      next(error);
    }
  }
);
