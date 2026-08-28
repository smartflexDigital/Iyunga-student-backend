// ==========================================================
// models/Admin.js — admin account (Settings: Change Password)
// Replaces the old .env-only credentials so the password can
// be changed at runtime, and so login still works after
// deployment (where editing .env on the live server isn't
// practical).
// ==========================================================

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
