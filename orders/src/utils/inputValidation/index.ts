import { check } from 'express-validator';
import mongoose from 'mongoose';

export const createOrderValidationRules = [
  check('ticketId')
    .not()
    .isEmpty()
    .withMessage('ticketId is missing')
    .bail()
    .custom((input) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId doesn't look good!"),
];
