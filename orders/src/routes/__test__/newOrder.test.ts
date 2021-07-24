import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import auth, { getNewValidUser } from '../../test/helpers/auth';
import { createTicket } from '../../test/helpers/ticket';
import { createOrder } from '../../test/helpers/order';
import { OrderStatus, Subjects } from '@ramtickets/common/dist';
import { Order } from '../../models/order';
import { natsWrapper } from '../../natsWrapper';
describe('New Order', () => {
  it("returns an error if ticket doesn't exists", async () => {
    const ticketId = mongoose.Types.ObjectId();
    const user = getNewValidUser();
    const cookie = auth.signIn(user);
    await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId })
      .expect(404);
  });
  it('returns an error if ticket already reserved', async () => {
    const ticket = await createTicket();
    await createOrder({
      ticket,
      status: OrderStatus.AwaitingPayment,
    });
    const user = getNewValidUser();
    const cookie = auth.signIn(user);
    await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(400);
  });
  it('creates an order', async () => {
    const ticket = await createTicket();
    const user = getNewValidUser();
    const cookie = auth.signIn(user);
    await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(200);
    const orders = await Order.find({}).count();
    expect(orders).toEqual(1);
  });
  it('emits order:created event', async () => {
    const ticket = await createTicket();
    const user = getNewValidUser();
    const cookie = auth.signIn(user);
    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id });

    const response = JSON.parse(res.text);
    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
      Subjects.OrderCreated,
      JSON.stringify({
        id: response.id,
        status: response.status,
        userId: response.userId,
        ticket: {
          id: response.ticket.id,
          price: response.ticket.price,
        },
        expiresAt: response.expiresAt,
        version: 0,
      }),
      expect.anything()
    );
  });
});
