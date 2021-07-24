import {
  Listener,
  Subjects,
  TicketCreatedEvent,
  ExpirationcompleteEvent,
  OrderStatus,
} from '@ramtickets/common/dist';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { natsWrapper } from '../../natsWrapper';
import { OrderCancelledPublisher } from '../publishers/orderCancelledPublisher';
import { queueGroupName } from './queueGroupName';

export class OrderExpiredListener extends Listener<ExpirationcompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationcompleteEvent['data'], msg: Message) {
    try {
      const { orderId } = data;
      const order = await Order.findById(orderId).populate('ticket');
      if (!order) throw new Error('order no found!');
      if (order.status === OrderStatus.Complete) return msg.ack();
      order.set({ status: OrderStatus.Canceled });
      await order.save();
      const { id, ticket, version } = order;
      await new OrderCancelledPublisher(natsWrapper.client).publish({
        id,
        ticket: { id: ticket.id },
        version,
      });
      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
