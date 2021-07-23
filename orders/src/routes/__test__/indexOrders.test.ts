import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import auth, { getNewValidUser } from '../../test/helpers/auth';
import { createOrder } from '../../test/helpers/order';
import { createTicket } from '../../test/helpers/ticket';

describe('Index user orders', () => {
  it('fetches orders for particular user', async () => {
    const user = getNewValidUser('r@r.com');
    const user2 = getNewValidUser('r2@r.com');
    const user1Cookie = auth.signIn(user);
    const user2Cookie = auth.signIn(user2);
    const ticket = await createTicket();
    const ticket2 = await createTicket();
    const ticket3 = await createTicket();
    await createOrder({ ticket, userId: user.id });
    await createOrder({ ticket: ticket2, userId: user.id });
    await createOrder({ ticket: ticket3, userId: user2.id });
    const res = await request(app)
      .get('/api/orders')
      .set('Cookie', user1Cookie)
      .send({});
    const res2 = await request(app)
      .get('/api/orders')
      .set('Cookie', user2Cookie)
      .send({});
    expect(JSON.parse(res.text).length).toEqual(2);
    expect(JSON.parse(res2.text).length).toEqual(1);
  });
});
