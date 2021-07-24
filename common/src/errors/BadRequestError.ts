import { CustomError } from './customError';

export class BadRequestError extends CustomError {
  statuscode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  formatError() {
    return [{ message: this.message }];
  }
}
