import { Event } from './base';
import { Subjects } from '../subjects';

export abstract class TicketUpdatedEvent implements Event {
  abstract subject: Subjects.TicketUpdated;
  abstract data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
  };
}
