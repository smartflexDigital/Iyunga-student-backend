// ==========================================================
// IYUNGA STUDENT MANAGEMENT — server.js
// Day 1: backend environment + basic Express server
// (Database connection + routes are added on Day 2)
// ==========================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const requireAuth = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Database ----------
connectDB();

// ---------- Middleware ----------
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
  })
);
app.use(express.json());

// ---------- Root route ----------
app.get("/", (req, res) => {
  res.json({
    message: "Iyunga Student Management API is running.",
    status: "ok",
  });
});

// ---------- Health check ----------
app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ---------- Auth routes (public) ----------
app.use("/api/auth", authRoutes);

// ---------- Student routes (protected — requires login) ----------
app.use("/api/students", requireAuth, studentRoutes);

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Iyunga backend server running on http://localhost:${PORT}`);
});
