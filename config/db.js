// ==========================================================
// config/db.js — MongoDB connection (Day 2)
// ==========================================================

const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  mongoose.set("bufferCommands", false);

  if (!uri) {
    console.error("MONGODB_URI is missing. Add it to your .env file.");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

module.exports = connectDB;
