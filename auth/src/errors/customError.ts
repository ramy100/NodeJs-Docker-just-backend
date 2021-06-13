export abstract class CustomError extends Error {
  abstract statuscode: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract formatError(): { message: string; field?: string }[];
}
