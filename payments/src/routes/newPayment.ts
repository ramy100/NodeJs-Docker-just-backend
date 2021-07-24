import {
  BadRequestError,
  NotFound,
  OrderStatus,
  requireAuth,
  UnAuthorizedError,
  validate,
} from '@ramtickets/common/dist';
import { NextFunction, Request, Response, Router } from 'express';
import { PaymentCreatedPublisher } from '../events/publishers/paymentCreatedPublisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../natsWrapper';
import { stripe } from '../stripe';
import { paymentValidationRules } from '../utils/inputValidation';

export const newPaymentRouter = Router();

newPaymentRouter.post(
  '',
  requireAuth,
  paymentValidationRules,
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, orderId } = req.body;
      const order = await Order.findById(orderId);
      if (!order) return next(new NotFound());
      if (order.userId !== req.currentUser!.id)
        return next(new UnAuthorizedError());
      if (order.status === OrderStatus.Canceled)
        return next(new BadRequestError('Order was cancelled'));
      const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
      });
      const payment = Payment.build({ orderId, stripeId: charge.id });
      await payment.save();
      new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });
      res.send({ id: payment.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
