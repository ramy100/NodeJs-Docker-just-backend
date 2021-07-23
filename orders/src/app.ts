import express from 'express';
import cors from 'cors';
import { newOrderRouter } from './routes/newOrder';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFound } from '@ramtickets/common/dist';
import { cancelOrderRouter } from './routes/cancelOrder';
import { indexOrdersRouter } from './routes/indexOrders';
import { showOrderRouter } from './routes/showOrder';

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
app.use(currentUser);
app.use('/api/orders', newOrderRouter);
app.use('/api/orders', cancelOrderRouter);
app.use('/api/orders', indexOrdersRouter);
app.use('/api/orders', showOrderRouter);
app.all('*', async (req, res, next) => {
  next(new NotFound());
});
app.use(errorHandler);
