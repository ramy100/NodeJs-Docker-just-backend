import { Subjects } from '../subjects';
import { Event } from './base';

export abstract class OrderCancelledEvent implements Event {
  abstract subject: Subjects.OrderCancelled;
  abstract data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}
