import { OrderCreatedEvent, OrderStatus } from '@ramtickets/common/dist';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../natsWrapper';
import { createTicket } from '../../../test/helpers/ticket';
import { OrderCreatedListener } from '../orderCreatedListener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const newTicket = await createTicket();
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: '1',
    expiresAt: '1',
    version: 0,
    ticket: {
      id: newTicket.id,
      price: newTicket.price,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

describe('Order created Listener', () => {
  it('sets the userId of the ticket', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(data.ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
  });
  it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
  it('publish a ticket updated event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
