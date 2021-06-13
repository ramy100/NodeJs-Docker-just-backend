import express from 'express';
import { BadRequestError } from '../errors/BadRequestError';
import { User } from '../models/User';

export const signUpRouter = express.Router();

signUpRouter.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(new BadRequestError('Email in use'));
    }
    const user = User.build({ email, password });
    await user.save();
    res.status(201).send(user);
  } catch (error) {}
});
