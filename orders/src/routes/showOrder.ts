import {
  NotFound,
  requireAuth,
  UnAuthorizedError,
} from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { Order } from '../models/order';

export const showOrderRouter = Router();

showOrderRouter.get(
  '/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    try {
      const order = await Order.findById(orderId);
      if (!order) return next(new NotFound());
      if (order.userId !== req.currentUser?.id)
        return next(new UnAuthorizedError());
      return res.send(order.toJSON());
    } catch (error) {
      next(error);
    }
  }
);
