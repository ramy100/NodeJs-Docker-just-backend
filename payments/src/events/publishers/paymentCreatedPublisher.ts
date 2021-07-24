import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@ramtickets/common/dist';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
