import { ErrorRequestHandler } from 'express';
import { CustomError } from '../errors/customError';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    console.log(err.message);
    return res.status(err.statuscode).json({
      message: err.formatError(),
    });
  }

  return res.status(500).send({
    errors: [{ message: 'something went wrong!' }],
  });
};
