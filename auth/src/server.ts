import express from 'express';
import cors from 'cors';
import { currentUserRouter } from './routes/currentUser';
import { singInRouter } from './routes/signIn';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFound } from './errors/notFound';
import Mongoose from 'mongoose';
const port = 4000;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', currentUserRouter);
app.use('/api/users', signUpRouter);
app.use('/api/users', singInRouter);
app.use('/api/users', signOutRouter);
app.all('*', async (req, res) => {
  throw new NotFound();
});
app.use(errorHandler);

const start = async () => {
  try {
    await Mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongoDB');
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => {
    console.log('app is lestining to port! ' + port);
  });
};

start();
