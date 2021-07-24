import { Listener, OrderCreatedEvent, Subjects } from '@ramtickets/common/dist';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticketUpdatedPublisher';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    try {
      const ticket = await Ticket.findById(data.ticket.id);
      if (!ticket) throw new Error('Ticket not found');
      ticket.set({ orderId: data.id });
      await ticket.save();
      const { id, title, price, version, userId, orderId } = ticket;
      await new TicketUpdatedPublisher(this.client).publish({
        id,
        title,
        price,
        version,
        userId,
        orderId,
      });
      msg.ack();
    } catch (error) {
      throw error;
    }
  }
}
