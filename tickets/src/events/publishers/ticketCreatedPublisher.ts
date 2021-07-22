import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@ramtickets/common/dist';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
