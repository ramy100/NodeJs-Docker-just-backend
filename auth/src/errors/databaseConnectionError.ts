export class DatabaseConnectionError extends Error {
  reason = 'Error connection to DB';
  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
