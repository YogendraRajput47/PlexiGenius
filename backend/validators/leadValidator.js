const { body, query, validationResult } = require('express-validator');

const createLeadRules = [
  body('company').notEmpty().withMessage('company is required'),
  body('email').optional().isEmail().withMessage('invalid email'),
  body('phone').optional().isMobilePhone('any').withMessage('invalid phone number'),
  body('tags').optional().custom(val => {
    if (typeof val === 'string') return true;
    if (Array.isArray(val)) return true;
    throw new Error('tags must be a comma separated string or array');
  }),
];

const updateLeadRules = [
  body('company').optional().notEmpty().withMessage('company cannot be empty'),
  body('email').optional().isEmail().withMessage('invalid email'),
  body('phone').optional().isMobilePhone('any').withMessage('invalid phone number'),
];

const searchRules = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1 }).toInt(),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });
  next();
};

module.exports = {
  createLeadRules,
  updateLeadRules,
  searchRules,
  handleValidation,
};
