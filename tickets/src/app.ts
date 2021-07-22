import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFound } from '@ramtickets/common/dist';
import { newTicketRouter } from './routes/newTicket';
import { showTicketRouter } from './routes/showTicket';
import { indexTicketsRouter } from './routes/indexTickets';
import { updateTicketRouter } from './routes/updateTicket';

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
app.use('/api/tickets', newTicketRouter);
app.use('/api/tickets', showTicketRouter);
app.use('/api/tickets', indexTicketsRouter);
app.use('/api/tickets', updateTicketRouter);

app.all('*', async (req, res, next) => {
  next(new NotFound());
});

app.use(errorHandler);
