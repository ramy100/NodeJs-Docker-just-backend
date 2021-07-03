import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { createTicket } from '../../test/helpers/ticket';
describe('show Tickets', () => {
  it('returns 404 if ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await createTicket();
    const res = await request(app).get(`/api/tickets/${id}`).send();
    expect(res.statusCode).toEqual(404);
  });

  it('returns ticket if found', async () => {
    const createdTicket = await createTicket();

    const res = await request(app)
      .get(`/api/tickets/${createdTicket.id}`)
      .send();
    expect(res.statusCode).toEqual(200);
  });
});
