import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expirationcompletePublisher';
import { natsWrapper } from '../natsWrapper';

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});
