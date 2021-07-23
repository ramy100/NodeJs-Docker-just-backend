import { requireAuth } from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { Order } from '../models/order';

export const indexOrdersRouter = Router();

indexOrdersRouter.get(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({ userId: req.currentUser!.id }).populate(
        'ticket'
      );
      return res.send(orders);
    } catch (error) {
      next(error);
    }
  }
);
