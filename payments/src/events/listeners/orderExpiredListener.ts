import {
  Listener,
  Subjects,
  OrderStatus,
  ExpirationcompleteEvent,
} from '@ramtickets/common/dist';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queueGroupName';

export class OrderExpiredListener extends Listener<ExpirationcompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationcompleteEvent['data'], msg: Message) {
    try {
      const { orderId } = data;
      const order = await Order.findById(orderId);
      if (!order) throw new Error('Order not found');
      if (order.status === OrderStatus.Complete) {
        msg.ack();
        throw new Error('order already paid');
      }
      order.set({ status: OrderStatus.Canceled });
      await order.save();
      msg.ack();
    } catch (error) {
      console.log(error.message);
    }
  }
}
