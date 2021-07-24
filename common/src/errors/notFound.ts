import { CustomError } from './customError';

export class NotFound extends CustomError {
  statuscode = 404;
  constructor() {
    super('Route Not Found');

    Object.setPrototypeOf(this, NotFound.prototype);
  }
  formatError(): { message: string; field?: string | undefined }[] {
    return [{ message: 'Not Found!' }];
  }
}
