import { check } from 'express-validator';

export const createTicketValidationRules = [
  check('title', "title does'nt look good").isAlphanumeric('en-US', {
    ignore: ' -',
  }),
  check('title', "title does'nt look good").not().isNumeric(),
  check('price').isNumeric(),
  check('price').isFloat({ min: 1 }),
];

export const updateTicketValidationRules = [
  check('title', "title does'nt look good").optional().isAlphanumeric('en-US', {
    ignore: ' -',
  }),
  check('title', "title does'nt look good").optional().not().isNumeric(),
  check('price').optional().isFloat({ min: 1 }),
];
