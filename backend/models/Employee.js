const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  position: String,
  status: { type: String, default: "Active" },
  numLeads: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
