const Lead = require("../models/Lead");
const Employee = require("../models/Employee");

// GET /api/leads
exports.getLeads = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query = {
        $or: [
          { company: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const [data, total] = await Promise.all([
      Lead.find(query)
        .populate("assignedTo")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),

      Lead.countDocuments(query),
    ]);

    res.json({
      success: true,
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/leads/:id
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo");
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/leads
exports.createLead = async (req, res) => {
  try {
    // inside createLead
    const body = req.body;
    if (req.file && req.file.path) body.imageUrl = req.file.path;

    if (body.tags && typeof body.tags === "string") {
      body.tags = body.tags.split(",").map((t) => t.trim());
    }

    const lead = await Lead.create(body);

    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/leads/:id
exports.updateLead = async (req, res) => {
  try {
    const body = req.body;
    if (req.file && req.file.path) body.imageUrl = req.file.path;

    if (body.tags && typeof body.tags === "string") {
      body.tags = body.tags.split(",").map((t) => t.trim());
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/leads/:id
exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/leads/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/leads/:id/assign
exports.assignEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (lead.assignedTo) {
      await Employee.findByIdAndUpdate(lead.assignedTo, {
        $inc: { numLeads: -1 },
      });
    }

    lead.assignedTo = employeeId;
    await lead.save();

    await Employee.findByIdAndUpdate(employeeId, {
      $inc: { numLeads: 1 },
    });

    const result = await Lead.findById(req.params.id).populate("assignedTo");

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
