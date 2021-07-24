import {
  ExpirationcompleteEvent,
  OrderCancelledEvent,
  OrderStatus,
  TicketUpdatedEvent,
} from '@ramtickets/common/dist';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { natsWrapper } from '../../natsWrapper';
import { createOrder } from '../../test/helpers/order';
import { OrderCancelledListener } from '../listeners/orderCancelledListener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const order = await createOrder({ version: 0 });
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: { id: 'afdsa' },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

describe('payments Order cancel listener', () => {
  it('payment updates order status on cancel', async () => {
    const { data, listener, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(data.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
    expect(msg.ack).toBeCalled();
    // expect(natsWrapper.client.publish).toBeCalled();
  });
});
