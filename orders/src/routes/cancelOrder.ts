import {
  NotFound,
  OrderStatus,
  requireAuth,
  UnAuthorizedError,
  validate,
} from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { Order } from '../models/order';
// import { natsWrapper } from '../natsWrapper';
import { createOrderValidationRules } from '../utils/inputValidation';

export const cancelOrderRouter = Router();

cancelOrderRouter.patch(
  '/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    try {
      const order = await Order.findById(orderId);
      if (!order) return next(new NotFound());
      if (order.userId !== req.currentUser?.id)
        return next(new UnAuthorizedError());
      order.status = OrderStatus.Canceled;
      await order.save();
      return res.send(order);
    } catch (error) {
      next(error);
    }
  }
);
