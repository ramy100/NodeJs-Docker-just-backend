import express from 'express';

export const signOutRouter = express.Router();

signOutRouter.get('/signout', (req, res) => {
  req.session = null;
  res.send('signed out');
});
