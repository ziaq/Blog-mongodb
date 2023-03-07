import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must have minimum 5 symbols').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must have minimum 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Name must have minimum 3 symbols').isLength({ min: 3 }),
  body('avatarUrl', 'Invalid link').optional().isURL(), // optional() means it is not necessary element
];

export const postCreateValidation = [
  body('title', 'Create title of article').isLength({ min: 3 }).isString(),
  body('text', 'Write text of article').isLength({ min: 10 }).isString(),
  body('tags', 'Invalid tags format (use array)').optional().isString(),
  body('imageUrl', 'Invalid link').optional().isString(),
];