import {
  Publisher,
  TicketUpdatedEvent,
  Subjects,
} from '@ramtickets/common/dist';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
