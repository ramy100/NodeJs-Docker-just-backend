import { Subjects } from '../subjects';
import { Event } from './base';

export abstract class ExpirationcompleteEvent implements Event {
  abstract subject: Subjects.ExpirationComplete;
  abstract data: {
    orderId: string;
  };
}
