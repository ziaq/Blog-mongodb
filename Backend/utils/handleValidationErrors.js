import { validationResult } from 'express-validator';

// Middeleware for processing errors after after validation
export default(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array()) // 'return' interrupt full function in app.post and return 'res'
  }

  next();
}