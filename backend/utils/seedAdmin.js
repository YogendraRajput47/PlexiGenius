require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await User.findOne({ username: "admin" });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const admin = new User({
    username: "admin",
    password: "admin123",
    name: "Super Admin"
  });

  await admin.save();
  console.log("Admin created  username: admin | password: admin123");
  process.exit(0);
}

seedAdmin();
