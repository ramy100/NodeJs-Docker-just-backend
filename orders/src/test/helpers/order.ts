import { OrderStatus } from '@ramtickets/common/dist';
import { Order, OrderAttrs } from '../../models/order';
import { TicketDoc } from '../../models/ticket';

export const createOrder = async (order: {
  ticket: TicketDoc;
  status?: OrderStatus;
  userId?: string;
  expiresAt?: Date;
}) => {
  const newOrder = Order.build({
    ticket: order.ticket,
    status: order?.status || OrderStatus.Created,
    userId: order?.userId || 'random',
    expiresAt: order?.expiresAt || new Date(),
  });
  return await newOrder.save();
};
