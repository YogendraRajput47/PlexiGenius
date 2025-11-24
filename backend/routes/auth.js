const router = require('express').Router();
const { login } = require('../controllers/authController');
const { loginRules, handleValidation } = require('../validators/authValidator');

router.post('/login', loginRules, handleValidation, login);

module.exports = router;
