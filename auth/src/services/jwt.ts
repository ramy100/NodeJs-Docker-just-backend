import Jwt from 'jsonwebtoken';
import { UserDoc, UserPayload } from '../models/User';

export class JwtManager {
  static sign(user: UserDoc) {
    return Jwt.sign(user.toJSON(), process.env.JWT_KEY!);
  }

  static verify(token: string) {
    try {
      return Jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    } catch (error) {
      return null;
    }
  }
}
