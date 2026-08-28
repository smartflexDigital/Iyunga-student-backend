// ==========================================================
// controllers/authController.js
// Login is now checked against the Admin collection in
// MongoDB (see scripts/seed-admin.js) instead of .env values,
// so the password can be changed at runtime — including after
// deployment.
// ==========================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign(
      { username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token: token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: "Login failed.", details: err.message });
  }
}

// PUT /api/auth/change-password  (protected — requires a valid token)
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }

    const admin = await Admin.findOne({ username: req.admin.username });
    if (!admin) {
      return res.status(404).json({ error: "Admin account not found." });
    }

    const currentMatches = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!currentMatches) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    admin.passwordHash = bcrypt.hashSync(newPassword, 10);
    await admin.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update password.", details: err.message });
  }
}

module.exports = { login, changePassword };
