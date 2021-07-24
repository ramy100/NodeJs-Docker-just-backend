import { TicketCreatedEvent } from '@ramtickets/common/dist';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../natsWrapper';
import { TicketCreatedListener } from '../ticketCreatedListener';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'random',
    price: 100,
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

describe('ticket created listener', () => {
  it('craetes and saves a ticket', async () => {
    const { data, listener, msg } = await setup();
    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
  });
  it('it acks the mesasge', async () => {
    const { data, listener, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
});
