import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFound } from '@ramtickets/common/dist';

export const app = express();
app.set('trust proxy', true);
app.use(cors());
app.use(express.json());

app.use(
  cookieSession({
    name: 'session',
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.all('*', async (req, res, next) => {
  next(new NotFound());
});

app.use(errorHandler);
