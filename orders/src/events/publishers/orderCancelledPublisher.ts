import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@ramtickets/common/dist';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
