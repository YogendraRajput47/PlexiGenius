const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const leadsController = require("../controllers/leadController");
const { createLeadRules, updateLeadRules, searchRules, handleValidation } = require('../validators/leadValidator');

router.use(auth);

router.get('/', searchRules, handleValidation, leadsController.getLeads);
router.get('/:id', leadsController.getLeadById);

router.post('/', upload, createLeadRules, handleValidation, leadsController.createLead);

router.put('/:id', upload, updateLeadRules, handleValidation, leadsController.updateLead);

router.delete('/:id', leadsController.deleteLead);

router.patch('/:id/status', leadsController.updateStatus);
router.patch('/:id/assign', leadsController.assignEmployee);

module.exports = router;
