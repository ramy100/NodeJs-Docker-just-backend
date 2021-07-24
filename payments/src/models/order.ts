import mongoose from 'mongoose';
import { OrderStatus } from '@ramtickets/common/dist';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface OrderAttrs {
  id: string;
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build: (attrs: OrderAttrs) => OrderDoc;
  findByEvent: (event: {
    id: string;
    version: number;
  }) => Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  const { id, version } = event;
  return await Order.findOne({ _id: id, version: version - 1 });
};

orderSchema.statics.build = (attrs: OrderAttrs) => {
  const { id, ...rest } = attrs;
  return new Order({ _id: id, ...rest });
};

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
