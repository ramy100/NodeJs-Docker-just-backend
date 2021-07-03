import Mongoose from 'mongoose';
import { app } from './app';
const port = 4000;

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');

  try {
    await Mongoose.connect(process.env.MONGO_URI!, {
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
