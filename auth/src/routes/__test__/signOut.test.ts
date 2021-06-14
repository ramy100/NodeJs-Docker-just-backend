import authHeplers from '../../test/helpers/auth';
import request from 'supertest';
import { app } from '../../app';
it('should return null user if signedout', async () => {
  const signUpResponse = await authHeplers.signUp('r@r.com', '123456', 201);
  const cookie = signUpResponse.get('Set-Cookie');
  const response = await request(app)
    .get('/api/users/me')
    .set('Cookie', cookie)
    .send();
  expect(response.body.user.email).toEqual('r@r.com');
  const signOUtResponse = await request(app).get('/api/users/signout');
  expect(signOUtResponse.body.user).toEqual(undefined);
});
