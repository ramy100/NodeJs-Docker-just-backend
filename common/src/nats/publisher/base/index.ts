import { Stan } from 'node-nats-streaming';
import { Event } from '../../events/base';

export abstract class Publisher<T extends Event> {
  protected client: Stan;
  abstract subject: T['subject'];
  publish(data: T['data']) {
    return new Promise<void>((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) reject(err);
        console.log(`Event Published / ${this.subject}`);
        resolve();
      });
    });
  }
  constructor(client: Stan) {
    this.client = client;
  }
}
