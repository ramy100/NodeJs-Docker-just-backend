import {
  Listener,
  Subjects,
  OrderStatus,
  PaymentCreatedEvent,
} from '@ramtickets/common/dist';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queueGroupName';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    try {
      const { id, orderId } = data;
      const order = await Order.findById(orderId);
      if (!order) throw new Error('Order not found');
      if (order.status === OrderStatus.Complete) {
        msg.ack();
        throw new Error('order already paid');
      }
      order.set({ status: OrderStatus.Complete });
      await order.save();
      msg.ack();
    } catch (error) {
      console.log(error.message);
    }
  }
}
