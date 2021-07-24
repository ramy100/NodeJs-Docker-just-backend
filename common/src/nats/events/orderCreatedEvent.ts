import { OrderStatus } from '../../orderStatus';
import { Subjects } from '../subjects';
import { Event } from './base';

export abstract class OrderCreatedEvent implements Event {
  abstract subject: Subjects.OrderCreated;
  abstract data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    version: number;
    ticket: {
      id: string;
      price: number;
    };
  };
}
