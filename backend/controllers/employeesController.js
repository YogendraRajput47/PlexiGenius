const Employee = require('../models/Employee');
const Lead = require('../models/Lead');

exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, data: employees });
  } catch (err) {
    next(err);
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data: emp });
  } catch (err) {
    next(err);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const payload = req.body;
    console.log("Creating employee with payload:", payload);
    const emp = await Employee.create(payload);
    res.status(201).json({ success: true, data: emp });
  } catch (err) {
    next(err);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    // Optional: On delete, unassign leads and decrement counts
    const empId = req.params.id;

    // Unassign leads assigned to this employee
    await Lead.updateMany({ assignedTo: empId }, { $unset: { assignedTo: '' }, $set: { status: 'New' } });

    await Employee.findByIdAndDelete(empId);
    res.json({ success: true, message: 'Employee deleted and related leads unassigned' });
  } catch (err) {
    next(err);
  }
};
