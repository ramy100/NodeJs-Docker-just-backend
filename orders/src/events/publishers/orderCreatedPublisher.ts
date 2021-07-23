import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from '@ramtickets/common/dist';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
