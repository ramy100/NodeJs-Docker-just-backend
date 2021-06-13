import express from 'express';

export const currentUserRouter = express.Router();

currentUserRouter.get('/me', (req, res) => {
  res.send('me');
});
