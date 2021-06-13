import express from 'express';

export const signOutRouter = express.Router();

signOutRouter.get('/signout', (req, res) => {
  res.send('signout');
});
