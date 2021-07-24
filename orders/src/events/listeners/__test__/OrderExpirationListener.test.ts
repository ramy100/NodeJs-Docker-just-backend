import {
  ExpirationcompleteEvent,
  OrderCancelledEvent,
  OrderStatus,
  TicketUpdatedEvent,
} from '@ramtickets/common/dist';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../natsWrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { createTicket } from '../../../test/helpers/ticket';
import { TicketUpdatedListener } from '../ticketUpdatedListener';
import { OrderExpiredListener } from '../OrderExpirationListener';
import { createOrder } from '../../../test/helpers/order';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderExpiredListener(natsWrapper.client);
  const ticket = await createTicket({ price: 50 });
  const order = await createOrder({ ticket });
  const data: ExpirationcompleteEvent['data'] = {
    orderId: order.id,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

describe('Order Expiration listener', () => {
  it('Updates order status to cancelled on expiration', async () => {
    const { data, listener, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(data.orderId);
    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
    expect(msg.ack).toBeCalled();
    expect(natsWrapper.client.publish).toBeCalled();
  });
});
