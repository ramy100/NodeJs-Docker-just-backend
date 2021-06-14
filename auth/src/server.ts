import Mongoose from 'mongoose';
import { app } from './app';
const port = 4000;

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

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
