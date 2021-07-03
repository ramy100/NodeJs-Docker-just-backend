import {
  NotFound,
  requireAuth,
  UnAuthorizedError,
  validate,
} from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { Ticket } from '../models/ticket';
import { updateTicketValidationRules } from '../utils/inputValidation';

export const updateTicketRouter = Router();

updateTicketRouter.post(
  '/:id',
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
          return res.send(JSON.stringify(doc.toJSON()));
        }
      );
    } catch (error) {
      next(error);
    }
  }
);
