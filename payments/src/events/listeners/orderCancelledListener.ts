import {
  Listener,
  Subjects,
  OrderCancelledEvent,
  OrderStatus,
} from '@ramtickets/common/dist';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queueGroupName';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    try {
      const { id, version } = data;
      const order = await Order.findByEvent({ id, version });
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
