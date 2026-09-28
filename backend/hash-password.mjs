import crypto from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('Usage: node hash-password.mjs "your-password"');
  process.exit(1);
}
const N = 16384, r = 8, p = 1, keyLength = 32;
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, keyLength, { N, r, p });
console.log(`scrypt$${N}$${r}$${p}$${salt.toString("hex")}$${hash.toString("hex")}`);
