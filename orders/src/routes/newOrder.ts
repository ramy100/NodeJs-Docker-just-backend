import {
  BadRequestError,
  NotFound,
  OrderStatus,
  requireAuth,
  validate,
} from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { OrderCreatedPublisher } from '../events/publishers/orderCreatedPublisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../natsWrapper';
import { createOrderValidationRules } from '../utils/inputValidation';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

export const newOrderRouter = Router();

newOrderRouter.post(
  '/',
  requireAuth,
  createOrderValidationRules,
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) return next(new NotFound());
      const isReserved = await ticket.isReserved();
      if (isReserved)
        return next(new BadRequestError('Ticket is already reserved'));
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);
      const order = Order.build({
        userId: req.currentUser!.id,
        expiresAt,
        status: OrderStatus.Created,
        ticket,
      });
      const newOrder = await order.save();
      const { id, status, userId } = newOrder;
      new OrderCreatedPublisher(natsWrapper.client).publish({
        id,
        status,
        userId,
        ticket: { id: ticket.id, price: ticket.price },
        expiresAt: newOrder.expiresAt.toISOString(),
        version: newOrder.version,
      });
      res.send(newOrder.toJSON());
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);
