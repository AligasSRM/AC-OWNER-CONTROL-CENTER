import test from "node:test";
import assert from "node:assert/strict";

const routes = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/session",
  "/api/auth/lock",
  "/api/auth/unlock",
  "/api/overview",
  "/api/users",
  "/api/videos",
  "/api/views",
  "/api/likes",
  "/api/payments",
  "/api/payouts",
  "/api/events",
  "/api/audit",
  "/api/alerts",
  "/api/health",
  "/api/control/stop-all"
];

test("backend contract route inventory remains explicit", () => {
  assert.equal(new Set(routes).size, routes.length);
  assert.ok(routes.includes("/api/control/stop-all"));
  assert.ok(routes.includes("/api/auth/lock"));
});
