import { CustomError } from './customError';

export class UnAuthorizedError extends CustomError {
  statuscode = 401;
  constructor() {
    super('Unauthorized');

    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  formatError() {
    return [{ message: 'Unauthorized' }];
  }
}
