import { NotFound, requireAuth, validate } from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { Ticket } from '../models/ticket';
import { createTicketValidationRules } from '../utils/inputValidation';

export const indexTicketsRouter = Router();

indexTicketsRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets = await Ticket.find({});
      return res.send(tickets);
    } catch (error) {
      next(error);
    }
  }
);
