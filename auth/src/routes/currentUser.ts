import express from 'express';
import { currentUser } from '../middleware/currentUser';
import { requireAuth } from '../middleware/requireAuth';
import { JwtManager } from '../services/jwt';

export const currentUserRouter = express.Router();

currentUserRouter.get('/me', currentUser, requireAuth, (req, res) => {
  const user = req.currentUser;
  res.json({ user });
});
