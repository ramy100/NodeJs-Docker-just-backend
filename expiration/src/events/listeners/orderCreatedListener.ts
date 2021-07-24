import { Listener, OrderCreatedEvent, Subjects } from '@ramtickets/common/dist';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expirationQueue';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(delay);
    try {
      expirationQueue.add(
        { orderId: data.id },
        {
          delay,
        }
      );
      msg.ack();
    } catch (error) {
      throw error;
    }
  }
}
