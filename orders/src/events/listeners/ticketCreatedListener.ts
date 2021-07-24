import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from '@ramtickets/common/dist';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queueGroupName';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    try {
      const { title, price, id } = data;
      const ticket = Ticket.build({
        id,
        title,
        price,
      });
      await ticket.save();
      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
