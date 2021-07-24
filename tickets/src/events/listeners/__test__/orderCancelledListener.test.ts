import { OrderCancelledEvent } from '@ramtickets/common/dist';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../natsWrapper';
import { createTicket } from '../../../test/helpers/ticket';
import { OrderCancelledListener } from '../orderCancelledListener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const newTicket = await createTicket();
  const orderId = mongoose.Types.ObjectId().toHexString();
  newTicket.set({ orderId });
  await newTicket.save();
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: newTicket.id,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

describe('Order cancelled Listener', () => {
  it('updates the ticket and publishes and acks a message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(data.ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
