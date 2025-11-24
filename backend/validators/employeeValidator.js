const { body, validationResult } = require('express-validator');

const createEmployeeRules = [
  body('name').notEmpty().withMessage('name is required'),
  body('email').optional().isEmail().withMessage('invalid email'),
  body('phone').optional().isMobilePhone('any').withMessage('invalid phone'),
];

const updateEmployeeRules = [
  body('name').optional().notEmpty().withMessage('name cannot be empty'),
  body('email').optional().isEmail().withMessage('invalid email'),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });
  next();
};

module.exports = {
  createEmployeeRules,
  updateEmployeeRules,
  handleValidation,
};
