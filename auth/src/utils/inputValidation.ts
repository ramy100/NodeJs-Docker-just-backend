import { check } from 'express-validator';
export const registerValidationRules = [
  check('email', "email does'nt look good").isEmail(),
  check(
    'password',
    'Enter a valid password with 6 or more characters'
  ).isLength({ min: 6 }),
  // check('firstName', 'first name is required').not().isEmpty(),
  // check('lastName', 'last name is required').not().isEmpty(),
  // ,check('passwordRepeat').custom((value, { req }) => {
  //   if (value !== req.body.password) {
  //     throw new Error("Password confirmation doesn't match!");
  //   }
  //   return true;
  // }),
];

export const loginValidationRules = [
  check('email', "email does'nt look good").isEmail(),
  check(
    'password',
    'please enter a password of at least 6 characters!'
  ).isLength({
    min: 6,
  }),
];
