import {
  BadRequestError,
  NotFound,
  requireAuth,
  UnAuthorizedError,
  validate,
} from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { TicketUpdatedPublisher } from '../events/publishers/ticketUpdatedPublisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../natsWrapper';
import { updateTicketValidationRules } from '../utils/inputValidation';

export const updateTicketRouter = Router();

updateTicketRouter.put(
  '/:id',
  requireAuth,
  updateTicketValidationRules,
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) return next(new NotFound());
      if (ticket.orderId)
        return next(new BadRequestError('Ticket is reserved!'));
      if (ticket.userId !== req.currentUser!.id)
        return next(new UnAuthorizedError());
      ticket.set({ ...req.body });
      await ticket.save();
      const { id, title, price, userId, version } = ticket;
      new TicketUpdatedPublisher(natsWrapper.client).publish({
        id,
        title,
        price,
        userId,
        version,
      });
      return res.send(ticket);
    } catch (error) {
      next(error);
    }
  }
);
