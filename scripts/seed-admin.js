// ==========================================================
// scripts/seed-admin.js
// Creates (or updates) the admin account directly in MongoDB.
// Run this once now to migrate off the old .env-based login,
// and again any time you want to reset the password from the
// command line (e.g. if you forget it).
//
// Usage:
//   node scripts/seed-admin.js <username> <password>
//   node scripts/seed-admin.js admin Iyunga2026!
// ==========================================================

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

async function run() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.log("Usage: node scripts/seed-admin.js <username> <password>");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing from your .env file.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const passwordHash = bcrypt.hashSync(password, 10);

  const admin = await Admin.findOneAndUpdate(
    { username: username },
    { username: username, passwordHash: passwordHash },
    { upsert: true, new: true }
  );

  console.log("Admin account ready: " + admin.username);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed to seed admin:", err.message);
  process.exit(1);
});
