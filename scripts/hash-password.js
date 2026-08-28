// ==========================================================
// scripts/hash-password.js
// Run this once to turn your chosen admin password into a
// secure hash to paste into .env — never store the plain
// password itself.
//
// Usage:
//   node scripts/hash-password.js MyChosenPassword123
// ==========================================================

const bcrypt = require("bcryptjs");

const plainPassword = process.argv[2];

if (!plainPassword) {
  console.log("Usage: node scripts/hash-password.js <your-password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(plainPassword, 10);

console.log("\nCopy this line into your .env file:\n");
console.log("ADMIN_PASSWORD_HASH=" + hash);
console.log("");
