import request from 'supertest';
import { app } from '../../app';
import { createTicket } from '../../test/helpers/ticket';

describe('index Tickets', () => {
  it('returns tickets ', async () => {
    const res1 = await request(app).get('/api/tickets').send();
    expect(JSON.parse(res1.text).length).toEqual(0);

    await createTicket();
    await createTicket();
    const res2 = await request(app).get('/api/tickets').send();
    expect(JSON.parse(res2.text).length).toEqual(2);
  });
});
