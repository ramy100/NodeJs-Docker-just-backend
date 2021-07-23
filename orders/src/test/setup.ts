import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
jest.mock('../natsWrapper');

let mongod: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'secret';
  mongod = new MongoMemoryServer();
  const mongoURI = await mongod.getUri();
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  collections.forEach(async (collection) => {
    await collection.deleteMany({});
  });
});

afterAll(async () => {
  await mongod.stop();
  await mongoose.connection.close();
});
