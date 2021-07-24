import { OrderStatus } from '@ramtickets/common/dist';
import mongoose from 'mongoose';
import { Order, OrderAttrs } from '../../models/order';

export const createOrder = async (order: Partial<OrderAttrs>) => {
  const newOrder = Order.build({
    id: order?.id || mongoose.Types.ObjectId().toHexString(),
    userId: order?.userId || 'random',
    status: order?.status || OrderStatus.Created,
    price: order?.price || 100,
    version: order?.version || 0,
  });
  return await newOrder.save();
};
