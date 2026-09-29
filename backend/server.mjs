import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const ORIGIN = process.env.CONTROL_ORIGIN || "http://localhost:" + PORT;
const OWNER_EMAIL = process.env.OWNER_EMAIL || "";
const OWNER_PASSWORD_HASH = process.env.OWNER_PASSWORD_HASH || "";
const TTL = Math.max(300, Number(process.env.SESSION_TTL_SECONDS || 3600));
const DATA_FILE = path.resolve(ROOT, process.env.DATA_FILE || "./data/runtime.json");

const memory = { sessions: new Map(), failures: new Map(), locked: false };

function ensureDataFile() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ audit: [] }, null, 2));
}
function readData() {
  ensureDataFile();
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); } catch { return { audit: [] }; }
}
function writeData(data) {
  ensureDataFile();
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}
function audit(action, target = "owner", metadata = {}) {
  const data = readData();
  data.audit = Array.isArray(data.audit) ? data.audit : [];
  data.audit.unshift({
    id: crypto.randomUUID(),
    action,
    target,
    metadata,
    occurred_at: new Date().toISOString()
  });
  data.audit = data.audit.slice(0, 200);
  writeData(data);
}
function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "content-length": Buffer.byteLength(payload)
  });
  res.end(payload);
}
function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || "").split(";").filter(Boolean).map(x => {
    const i = x.indexOf("=");
    return [x.slice(0, i).trim(), decodeURIComponent(x.slice(i + 1).trim())];
  }));
}
function setSessionCookie(res, token, maxAge) {
  res.setHeader("set-cookie", `ac_owner_session=${encodeURIComponent(token)}; HttpOnly; SameSite=None; Path=/; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
}
function clearSessionCookie(res) {
  res.setHeader("set-cookie", "ac_owner_session=; HttpOnly; SameSite=None; Path=/; Max-Age=0");
}
function allowedOrigin(req) {
  const origin = req.headers.origin;
  return !origin || origin === ORIGIN;
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 100_000) req.destroy();
    });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error("invalid json")); }
    });
    req.on("error", reject);
  });
}
function timingSafeEqualText(a, b) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}
function verifyPassword(password, encoded) {
  try {
    const [scheme, n, r, p, saltHex, hashHex] = encoded.split("$");
    if (scheme !== "scrypt") return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = crypto.scryptSync(password, salt, expected.length, { N: Number(n), r: Number(r), p: Number(p) });
    return crypto.timingSafeEqual(actual, expected);
  } catch { return false; }
}
function rateLimited(key) {
  const now = Date.now();
  const item = memory.failures.get(key);
  if (!item || now - item.windowStart > 15 * 60_000) return false;
  return item.count >= 8;
}
function recordFailure(key) {
  const now = Date.now();
  const item = memory.failures.get(key);
  if (!item || now - item.windowStart > 15 * 60_000) memory.failures.set(key, { count: 1, windowStart: now });
  else item.count += 1;
}
function session(req) {
  const token = parseCookies(req).ac_owner_session;
  const item = token && memory.sessions.get(token);
  if (!item || item.expiresAt < Date.now()) {
    if (token) memory.sessions.delete(token);
    return null;
  }
  return item;
}
function requireOwner(req, res) {
  const s = session(req);
  if (!s) { json(res, 401, { ok: false, error: "OWNER_AUTH_REQUIRED" }); return null; }
  if (memory.locked) { json(res, 423, { ok: false, error: "OWNER_CONTROL_LOCKED" }); return null; }
  return s;
}

const demo = {
  overview: { online: 12, users: 1284, videos: 342, views: 18492, likes: 6731, payments: 4820, payouts: 1260, security: "SECURE" },
  users: ["user_1284 — online", "user_1198 — online 2m", "user_1190 — offline", "user_1104 — online 4m"],
  videos: ["video_0342 — uploaded", "video_0318 — published", "video_0309 — processing"],
  views: ["18,492 total views", "92 qualified views today", "4,820 watch sessions"],
  likes: ["6,731 total likes", "+48 today", "video_0318 — +12"],
  payments: ["$4,820 completed", "$520 pending", "$140 failed"],
  payouts: ["$1,260 paid", "$340 processing", "2 requests under review"],
  events: ["USER_LOGIN user_1284", "VIDEO_UPLOADED video_0342"],
  alerts: ["INFO — Demo alert"],
  health: ["Frontend — online", "Database — ready", "Event pipeline — ready"]
};

const server = http.createServer(async (req, res) => {
  res.setHeader("access-control-allow-origin", ORIGIN);
  res.setHeader("access-control-allow-credentials", "true");
  res.setHeader("vary", "Origin");

  if (!allowedOrigin(req)) return json(res, 403, { ok: false, error: "ORIGIN_NOT_ALLOWED" });
  if (req.method === "OPTIONS") {
    res.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
    res.setHeader("access-control-allow-headers", "content-type");
    return json(res, 204, {});
  }

  const url = new URL(req.url, ORIGIN);
  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      return json(res, 200, { ok: true, service: "owner-control-backend", status: "ready", mode: process.env.NODE_ENV || "development" });
    }

    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const key = req.socket.remoteAddress || "unknown";
      if (rateLimited(key)) return json(res, 429, { ok: false, error: "LOGIN_RATE_LIMITED" });
      const valid = OWNER_EMAIL && OWNER_PASSWORD_HASH && email === OWNER_EMAIL.toLowerCase() && verifyPassword(password, OWNER_PASSWORD_HASH);
      if (!valid) {
        recordFailure(key);
        audit("LOGIN_FAILED", "owner", { source: "backend" });
        return json(res, 401, { ok: false, error: "INVALID_OWNER_CREDENTIALS" });
      }
      const token = crypto.randomBytes(32).toString("base64url");
      memory.sessions.set(token, { owner: email, createdAt: Date.now(), expiresAt: Date.now() + TTL * 1000 });
      audit("OWNER_LOGIN", email);
      setSessionCookie(res, token, TTL);
      return json(res, 200, { ok: true, owner: email, expires_in: TTL });
    }

    if (req.method === "POST" && url.pathname === "/api/auth/logout") {
      const s = session(req);
      const token = parseCookies(req).ac_owner_session;
      if (token) memory.sessions.delete(token);
      clearSessionCookie(res);
      if (s) audit("OWNER_LOGOUT", s.owner);
      return json(res, 200, { ok: true });
    }

    if (req.method === "GET" && url.pathname === "/api/auth/session") {
      const s = session(req);
      return json(res, 200, { ok: true, authenticated: Boolean(s), locked: memory.locked, owner: s?.owner || null });
    }

    if (req.method === "POST" && (url.pathname === "/api/auth/lock" || url.pathname === "/api/auth/unlock")) {
      const s = session(req);
      if (!s) return json(res, 401, { ok: false, error: "OWNER_AUTH_REQUIRED" });
      memory.locked = url.pathname.endsWith("/lock");
      audit(memory.locked ? "OWNER_LOCK" : "OWNER_UNLOCK", s.owner);
      return json(res, 200, { ok: true, locked: memory.locked });
    }

    const privileged = requireOwner(req, res);
    if (!privileged) return;

    const simple = {
      "/api/overview": ["overview", demo.overview],
      "/api/users": ["users", demo.users],
      "/api/videos": ["videos", demo.videos],
      "/api/views": ["views", demo.views],
      "/api/likes": ["likes", demo.likes],
      "/api/payments": ["payments", demo.payments],
      "/api/payouts": ["payouts", demo.payouts],
      "/api/events": ["events", demo.events],
      "/api/alerts": ["alerts", demo.alerts],
      "/api/health": ["health", demo.health]
    };
    if (req.method === "GET" && simple[url.pathname]) {
      return json(res, 200, { ok: true, data: simple[url.pathname][1], mode: "backend-demo" });
    }
    if (req.method === "GET" && url.pathname === "/api/audit") {
      return json(res, 200, { ok: true, data: readData().audit || [] });
    }
    if (req.method === "POST" && url.pathname === "/api/control/stop-all") {
      audit("STOP_ALL_REQUESTED", privileged.owner, { result: "simulation-only", connected_services: 0 });
      return json(res, 200, { ok: true, executed: false, reason: "NO_CONNECTED_SERVICES_FAIL_CLOSED" });
    }

    return json(res, 404, { ok: false, error: "NOT_FOUND" });
  } catch (error) {
    audit("BACKEND_ERROR", "server", { message: error.message });
    return json(res, 500, { ok: false, error: "INTERNAL_SERVER_ERROR" });
  }
});

const HOST = process.env.HOST || "0.0.0.0";
server.listen(PORT, HOST, () => {
  console.log(`AC Owner Control backend listening on http://${HOST}:${PORT}`);
});
