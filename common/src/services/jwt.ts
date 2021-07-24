import Jwt from 'jsonwebtoken';
import { UserPayload } from '../interfaces';

export class JwtManager {
  static sign(user: any) {
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
