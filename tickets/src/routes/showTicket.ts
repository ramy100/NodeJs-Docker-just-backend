import { NotFound, requireAuth, validate } from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { Ticket } from '../models/ticket';
import { createTicketValidationRules } from '../utils/inputValidation';

export const showTicketRouter = Router();

showTicketRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (ticket) return res.send(ticket);
      return next(new NotFound());
    } catch (error) {
      next(error);
    }
  }
);
