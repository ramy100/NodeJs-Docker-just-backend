import express, { NextFunction, Response } from 'express';
import { User } from '../models/User';
import { registerValidationRules } from '../utils/inputValidation';
import { Request } from 'express-validator/src/base';
import { BadRequestError, JwtManager, validate } from '@ramtickets/common/dist';
export const signUpRouter = express.Router();

signUpRouter.post(
  '/signup',
  registerValidationRules,
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        next(new BadRequestError('Email in use'));
      }
      const user = User.build({ email, password });
      await user.save();
      const token = JwtManager.sign(user);
      req.session = { jwt: token };
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }
);
