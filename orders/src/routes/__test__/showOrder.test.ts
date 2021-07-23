import request from 'supertest';
import { app } from '../../app';
import auth, { getNewValidUser } from '../../test/helpers/auth';
import { createOrder } from '../../test/helpers/order';
import { createTicket } from '../../test/helpers/ticket';

describe('Show orders', () => {
  it('should return user order by id', async () => {
    const user = getNewValidUser();
    const cookie = auth.signIn(user);
    const ticket = await createTicket();
    const order = await createOrder({ ticket, userId: user.id });
    const res = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .send();
    expect(JSON.parse(res.text).id).toEqual(order.id);
  });
  it('should authorise user before showing', async () => {
    const user = getNewValidUser('r@r.com');
    const user2 = getNewValidUser('r2@r.com');
    const cookie = auth.signIn(user2);
    const ticket = await createTicket();
    const order = await createOrder({ ticket, userId: user.id });
    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .send()
      .expect(401);
  });
});
