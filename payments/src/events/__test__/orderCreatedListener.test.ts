import { OrderCreatedEvent, OrderStatus } from '@ramtickets/common/dist';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../natsWrapper';
import { OrderCreatedListener } from '../orderCreatedListener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'asd',
    userId: 'sad',
    status: OrderStatus.Created,
    ticket: { id: 'asdf', price: 10 },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe('payment order created listener', () => {
  it('replicates the order info', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
});
