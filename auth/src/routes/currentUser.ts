import express from 'express';
import { currentUser, requireAuth } from '@ramtickets/common/dist';

export const currentUserRouter = express.Router();

currentUserRouter.get('/me', currentUser, requireAuth, (req, res) => {
  const user = req.currentUser;
  res.json({ user });
});
