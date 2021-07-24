import { Subjects } from '../subjects';
import { Event } from './base';

export abstract class PaymentCreatedEvent implements Event {
  abstract subject: Subjects.PaymentCreated;
  abstract data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
