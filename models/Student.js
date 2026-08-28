// ==========================================================
// models/Student.js — Mongoose schema (Day 2)
// Mirrors the fields already used in the frontend form
// ==========================================================

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    admission: { type: String, required: true, unique: true, trim: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    dob: { type: String },
    class: {
      type: String,
      required: true,
      enum: ["Form I", "Form II", "Form III", "Form IV", "Form V", "Form VI"],
    },
    stream: { type: String, trim: true },
    guardian: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("Student", studentSchema);
