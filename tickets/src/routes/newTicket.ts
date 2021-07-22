import { requireAuth, validate } from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { TicketCreatedPublisher } from '../events/publishers/ticketCreatedPublisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../natsWrapper';
import { createTicketValidationRules } from '../utils/inputValidation';

export const newTicketRouter = Router();

newTicketRouter.post(
  '/new',
  requireAuth,
  createTicketValidationRules,
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = Ticket.build({ userId: req.currentUser!.id, ...req.body });
    try {
      await ticket.save();
      const { id, title, price, userId } = ticket.toJSON();
      new TicketCreatedPublisher(natsWrapper.client).publish({
        id,
        title,
        price,
        userId,
      });
      res.send({ id, title, price, userId });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
