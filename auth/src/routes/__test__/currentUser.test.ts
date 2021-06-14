import authHeplers from '../../test/helpers/auth';
import request from 'supertest';
import { app } from '../../app';

it('returns a user if signedIn', async () => {
  const response = await authHeplers.signUp('r@r.com', '123456', 201);
  const cookie = response.get('Set-Cookie');
  const result = await request(app)
    .get('/api/users/me')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(result.body.user.email).toEqual('r@r.com');
});

it('returns a null user if not signedIn', async () => {
  const result = await request(app).get('/api/users/me').send().expect(401);
  expect(result.body.user).toEqual(undefined);
});
