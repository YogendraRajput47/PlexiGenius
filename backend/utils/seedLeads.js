// src/utils/seedLeads.js
require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('../models/Lead');

const leads = [
  {
    company: "DesignCo UI",
    email: "ui@designco.com",
    phone: "9000000001",
    tags: ["figma","ui"],
    status: "New",
    imageUrl: "file:///mnt/data/Screenshot 2025-11-24 122428.png"
  },
  {
    company: "Acme Sales",
    email: "sales@acme.com",
    phone: "9000000002",
    tags: ["sales","priority"],
    status: "Followup",
    imageUrl: "file:///mnt/data/Screenshot 2025-11-24 122443.png"
  },
  {
    company: "GreenTech",
    email: "contact@greentech.com",
    phone: "9000000003",
    tags: ["lead","b2b"],
    status: "Contacted",
    imageUrl: "file:///mnt/data/Screenshot 2025-11-24 122452.png"
  },
  {
    company: "HealthCorp",
    email: "hello@healthcorp.com",
    phone: "9000000004",
    tags: ["medical","important"],
    status: "New",
    imageUrl: "file:///mnt/data/Screenshot 2025-11-24 122537.png"
  },
  {
    company: "EduLabs",
    email: "team@edulabs.com",
    phone: "9000000005",
    tags: ["edtech"],
    status: "Followup",
    imageUrl: "file:///mnt/data/Screenshot 2025-11-24 122549.png"
  },
  {
    company: "RetailOne",
    email: "ops@retailone.com",
    phone: "9000000006",
    tags: ["retail"],
    status: "New",
    imageUrl: "file:///mnt/data/Screenshot 2025-11-24 122609.png"
  },
  {
    company: "LogiX",
    email: "support@logix.com",
    phone: "9000000007",
    tags: ["logistics"],
    status: "Contacted",
    imageUrl: "file:///mnt/data/Screenshot 2025-11-24 122616.png"
  },
  {
    company: "FinEdge",
    email: "founder@finedge.com",
    phone: "9000000008",
    tags: ["finance"],
    status: "New",
    imageUrl: "file:///mnt/data/Screenshot 2025-11-24 122622.png"
  },
  {
    company: "AutoDrive",
    email: "sales@autodrive.com",
    phone: "9000000009",
    tags: ["automotive"],
    status: "Followup",
    imageUrl: "file:///mnt/data/Screenshot 2025-11-24 122630.png"
  },
  {
    company: "HomeStyle",
    email: "contact@homestyle.com",
    phone: "9000000010",
    tags: ["home","retail"],
    status: "New",
    imageUrl: "file:///mnt/data/Screenshot 2025-11-24 122659.png"
  }
];

async function seed() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/crmdb';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding...');

    // Optional: remove existing sample leads with these companies (idempotent-ish)
    const companyNames = leads.map(l => l.company);
    await Lead.deleteMany({ company: { $in: companyNames } });

    const inserted = await Lead.insertMany(leads);
    console.log(`Inserted ${inserted.length} sample leads.`);
    inserted.forEach(l => console.log(` - ${l.company} -> ${l.imageUrl}`));

    await mongoose.disconnect();
    console.log('Disconnected. Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
