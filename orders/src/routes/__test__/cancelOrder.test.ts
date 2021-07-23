import { OrderStatus, Subjects } from '@ramtickets/common/dist';
import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../natsWrapper';
import auth, { getNewValidUser } from '../../test/helpers/auth';
import { createOrder } from '../../test/helpers/order';
import { createTicket } from '../../test/helpers/ticket';

describe('Cancel orders', () => {
  it('should cancel order', async () => {
    const user = getNewValidUser();
    const cookie = auth.signIn(user);
    const ticket = await createTicket();
    const order = await createOrder({ ticket, userId: user.id });
    const res = await request(app)
      .patch(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .send();
    expect(JSON.parse(res.text).status).toEqual(OrderStatus.Canceled);
  });

  it('should authorise user before cancelling', async () => {
    const user = getNewValidUser('r@r.com');
    const user2 = getNewValidUser('r2@r.com');
    const cookie = auth.signIn(user2);
    const ticket = await createTicket();
    const order = await createOrder({ ticket, userId: user.id });
    await request(app)
      .patch(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .send()
      .expect(401);
  });

  it('should emit cancel event after cancelling', async () => {
    const user = getNewValidUser();
    const cookie = auth.signIn(user);
    const ticket = await createTicket();
    const order = await createOrder({ ticket, userId: user.id });
    await request(app)
      .patch(`/api/orders/${order.id}`)
      .set('Cookie', cookie)
      .send();
    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
      Subjects.OrderCancelled,
      JSON.stringify({
        id: order.id,
        ticket: { id: ticket.id },
      }),
      expect.anything()
    );
  });
});
