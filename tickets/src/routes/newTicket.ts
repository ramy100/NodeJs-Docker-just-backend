import { requireAuth, validate } from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { Ticket } from '../models/ticket';
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
      res.send(ticket.toJSON());
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
