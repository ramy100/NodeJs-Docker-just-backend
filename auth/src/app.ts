import express from 'express';
import cors from 'cors';
import { currentUserRouter } from './routes/currentUser';
import { singInRouter } from './routes/signIn';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFound } from './errors/notFound';
import cookieSession from 'cookie-session';

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
app.use('/api/users', currentUserRouter);
app.use('/api/users', signUpRouter);
app.use('/api/users', singInRouter);
app.use('/api/users', signOutRouter);
app.all('*', async (req, res, next) => {
  next(new NotFound());
});
app.use(errorHandler);
