import request from 'supertest';
import { app } from '../../app';
import auth, { getNewValidUser } from '../../test/helpers/auth';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../natsWrapper';

describe('create Tickets', () => {
  it('has route for /api/tickets', async () => {
    const res = await request(app).post('/api/tickets').send();
    expect(res.statusCode).not.toEqual(404);
  });

  it('can only be accessed if a user is signed', async () => {
    const res = await request(app).post('/api/tickets').send();
    expect(res.statusCode).toEqual(401);
  });

  it('can be accessed if a user is signed with status code other than 401', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send();

    expect(res.statusCode).not.toEqual(401);
  });

  it('returns error if invalid title was provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ title: '', price: 10 })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ title: '122', price: 10 })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ title: 123, price: 10 })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ price: 10 })
      .expect(400);
  });

  it('returns error if invalid price was provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ title: 'iam a valid title 25', price: null })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ title: 'iam a valid title 25', price: 0 })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ title: 'iam a valid title 25' })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ title: 'iam a valid title 25', price: -1 })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ title: 'iam a valid title 25', price: '-1' })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ title: 'iam a valid title 25', price: 'hi' })
      .expect(400);
  });

  it('allows adding new ticket', async () => {
    let tickets = await Ticket.find({});
    const validTicket = { title: 'iam a valid title 25', price: 1 };
    expect(tickets.length).toEqual(0);
    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send(validTicket)
      .expect(200);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
  });

  it('publishs created ticket event upon creation', async () => {
    const validTicket = { title: 'iam a valid title 25', price: 1 };
    await request(app)
      .post('/api/tickets')
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send(validTicket)
      .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
