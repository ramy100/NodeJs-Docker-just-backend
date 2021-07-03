import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import auth, { getNewValidUser } from '../../test/helpers/auth';
import { createTicket } from '../../test/helpers/ticket';

describe('update Tickets', () => {
  it('allows only logged in users', async () => {
    const createdTicket = await createTicket();
    const res = await request(app)
      .post(`/api/tickets/update/${createdTicket.id}`)
      .send({});
    expect(res.statusCode).toEqual(401);
  });
  it('allows only ticket owner to update', async () => {
    const user = getNewValidUser();
    const createdTicket = await createTicket({ userId: user.id });
    const res = await request(app)
      .post(`/api/tickets/update/${createdTicket.id}`)
      .set('Cookie', auth.signIn(user))
      .send({});
    expect(res.statusCode).toEqual(200);
  });

  it('denies non-owner to update', async () => {
    const user = getNewValidUser();
    const id = new mongoose.Types.ObjectId().toHexString();
    const createdTicket = await createTicket({ userId: id });
    const res = await request(app)
      .post(`/api/tickets/update/${createdTicket.id}`)
      .set('Cookie', auth.signIn(user))
      .send({});
    expect(res.statusCode).toEqual(401);
  });

  it('returns 404 if ticket not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app)
      .post(`/api/tickets/update/${id}`)
      .set('Cookie', auth.signIn(getNewValidUser()))
      .send({ price: 5 });
    expect(res.statusCode).toEqual(404);
  });
  it('returns updated ticket', async () => {
    const user = getNewValidUser();
    const newTicket = await createTicket({
      price: 1,
      title: 'valid title',
      userId: user.id,
    });
    const cookie = auth.signIn(user);

    let updateValues1 = { price: 5 };
    const res = await request(app)
      .post(`/api/tickets/update/${newTicket.id}`)
      .set('Cookie', cookie)
      .send(updateValues1);
    expect(JSON.parse(res.text)).toHaveProperty('price', updateValues1.price);

    let updateValues2 = { title: 'valid title' };
    const res2 = await request(app)
      .post(`/api/tickets/update/${newTicket.id}`)
      .set('Cookie', cookie)
      .send(updateValues2);
    expect(JSON.parse(res2.text)).toHaveProperty('title', updateValues2.title);

    let updateValues3 = { title: 'valid title3', price: 33 };
    const res3 = await request(app)
      .post(`/api/tickets/update/${newTicket.id}`)
      .set('Cookie', cookie)
      .send(updateValues3);
    expect(JSON.parse(res3.text)).toHaveProperty('title', updateValues3.title);
    expect(JSON.parse(res3.text)).toHaveProperty('price', updateValues3.price);
  });

  it('returns 400 bad requrst for invalid inputs', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = auth.signIn(getNewValidUser());

    await request(app)
      .post(`/api/tickets/update/${id}`)
      .set('Cookie', cookie)
      .send({ price: 'hi' })
      .expect(400);
    await request(app)
      .post(`/api/tickets/update/${id}`)
      .set('Cookie', cookie)
      .send({ price: -1 })
      .expect(400);
    await request(app)
      .post(`/api/tickets/update/${id}`)
      .set('Cookie', cookie)
      .send({ title: '-1' })
      .expect(400);
    await request(app)
      .post(`/api/tickets/update/${id}`)
      .set('Cookie', cookie)
      .send({ title: '1' })
      .expect(400);
    await request(app)
      .post(`/api/tickets/update/${id}`)
      .set('Cookie', cookie)
      .send({ title: null })
      .expect(400);
    await request(app)
      .post(`/api/tickets/update/${id}`)
      .set('Cookie', cookie)
      .send({ title: 0 })
      .expect(400);
    await request(app)
      .post(`/api/tickets/update/${id}`)
      .set('Cookie', cookie)
      .send({ price: null })
      .expect(400);
    await request(app)
      .post(`/api/tickets/update/${id}`)
      .set('Cookie', cookie)
      .send({ price: 0 })
      .expect(400);
  });
});
