import {
  ExpirationcompleteEvent,
  Publisher,
  Subjects,
} from '@ramtickets/common/dist';

export class ExpirationCompletePublisher extends Publisher<ExpirationcompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
