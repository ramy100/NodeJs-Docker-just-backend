import { JwtManager } from '@ramtickets/common/dist';
import mongoose from 'mongoose';

interface Payload {
  id: string;
  email: string;
  password: string;
  toJSON: () => {
    id: string;
    email: string;
  };
}

export const getNewValidUser = (email: string = 'r@r.com') => ({
  id: new mongoose.Types.ObjectId().toHexString(),
  email,
  password: '1234567',
  toJSON: function () {
    return { id: this.id, email: this.email };
  },
});

function signIn(payload: Payload) {
  const token = JwtManager.sign(payload);
  const sessionJson = JSON.stringify({ jwt: token });
  const base64 = Buffer.from(sessionJson).toString('base64');
  return [`session=${base64}; Path=/; Secure; HttpOnly;`];
}

export default { signIn };
