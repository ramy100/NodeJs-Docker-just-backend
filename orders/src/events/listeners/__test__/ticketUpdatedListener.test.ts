import { TicketUpdatedEvent } from '@ramtickets/common/dist';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../natsWrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { createTicket } from '../../../test/helpers/ticket';
import { TicketUpdatedListener } from '../ticketUpdatedListener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = await createTicket({ price: 50 });
  const { id, price, title, version } = ticket;
  const data: TicketUpdatedEvent['data'] = {
    id,
    title: 'KOKO',
    price: 150,
    version: version + 1,
    userId: 'random',
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

describe('ticket update listener', () => {
  it('updates and saves a ticket', async () => {
    const { data, listener, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(data.id);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.version).toEqual(data.version);
  });
  it('it acks the mesasge', async () => {
    const { data, listener, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
  it("it doesn't acks the messge if wrong version", async () => {
    const { data, listener, msg } = await setup();
    data.version += 1;
    await listener.onMessage(data, msg);
    expect(msg.ack).not.toHaveBeenCalled();
  });
});
