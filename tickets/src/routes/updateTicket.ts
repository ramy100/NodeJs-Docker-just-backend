import {
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

updateTicketRouter.post(
  '/update/:id',
  requireAuth,
  updateTicketValidationRules,
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Ticket.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, useFindAndModify: true },
        (err, doc) => {
          if (err) return next(err);
          if (!doc) return next(new NotFound());
          if (doc.userId !== req.currentUser?.id)
            return next(new UnAuthorizedError());
          const { id, title, price, userId } = doc.toJSON();
          new TicketUpdatedPublisher(natsWrapper.client).publish({
            id,
            title,
            price,
            userId,
          });
          return res.send(
            JSON.stringify({
              id,
              title,
              price,
              userId,
            })
          );
        }
      );
    } catch (error) {
      next(error);
    }
  }
);
