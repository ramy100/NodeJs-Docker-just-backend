import { check } from 'express-validator';

export const paymentValidationRules = [
  check('token', 'token is missing').not().isEmpty(),
  check('orderId', 'orderId is missing').not().isEmpty(),
];
