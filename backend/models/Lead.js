const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  company: { type: String, required: true },
  email: String,
  phone: String,
  tags: [String],
  status: { type: String, default: "New" },
  source: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
