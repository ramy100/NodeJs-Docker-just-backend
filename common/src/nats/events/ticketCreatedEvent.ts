import { Subjects } from '../subjects';
import { Event } from './base';

export abstract class TicketCreatedEvent implements Event {
  abstract subject: Subjects.TicketCreated;
  abstract data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
  };
}
