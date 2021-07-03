import {
  BadRequestError,
  validate,
  JwtManager,
  PasswordManager,
} from '@ramtickets/common/dist';
import express, { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { loginValidationRules } from '../utils/inputValidation';
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
