import { Listener, Subjects, OrderCreatedEvent } from '@ramtickets/common/dist';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    try {
      const { id, ticket, version, status, userId } = data;
      const { price } = ticket;
      const order = Order.build({ id, price, status, userId, version });
      await order.save();
      msg.ack();
    } catch (error) {
      console.log(error.message);
    }
  }
}
