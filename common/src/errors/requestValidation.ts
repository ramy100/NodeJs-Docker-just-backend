import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class RequestValitaionError extends CustomError {
  statuscode = 400;
  constructor(private error: ValidationError[]) {
    super('Invalid request parameters');

    // only because we are extending a build in class
    Object.setPrototypeOf(this, RequestValitaionError.prototype);
  }
  formatError() {
    return this.error.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
