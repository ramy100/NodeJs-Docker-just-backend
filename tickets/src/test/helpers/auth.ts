import request from 'supertest';
import { app } from '../../app';

async function signUp(
  email: string,
  password: string,
  expectedResponse: number
) {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(expectedResponse);

  return response;
}

async function signIn(
  email: string,
  password: string,
  expectedResponse: number
) {
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password,
    })
    .expect(expectedResponse);

  return response;
}

export default { signUp, signIn };
