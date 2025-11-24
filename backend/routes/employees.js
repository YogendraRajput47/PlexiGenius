// src/routes/employees.js
const router = require('express').Router();
const auth = require('../middlewares/auth');
const employeesController = require('../controllers/employeesController');
const { createEmployeeRules, updateEmployeeRules, handleValidation } = require('../validators/employeeValidator');


router.use(auth);

const upload = require('../middlewares/upload');
router.get('/', employeesController.getEmployees);
router.get('/:id', employeesController.getEmployee);

router.post('/', upload, createEmployeeRules, handleValidation, employeesController.createEmployee);

router.put('/:id', upload, updateEmployeeRules, handleValidation, employeesController.updateEmployee);

router.delete('/:id', employeesController.deleteEmployee);

module.exports = router;
