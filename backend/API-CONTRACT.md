# AC Owner Control Center — Backend Contract

This contract is intentionally independent from XKiss.

## Security model

The browser is never trusted with owner credentials, password hashes, provider secrets, or privileged commands.

### Authentication
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session
- POST /api/auth/lock
- POST /api/auth/unlock

### Owner controls
- GET /api/overview
- GET /api/users
- GET /api/videos
- GET /api/views
- GET /api/likes
- GET /api/payments
- GET /api/payouts
- GET /api/events
- GET /api/audit
- GET /api/alerts
- GET /api/health
- POST /api/control/stop-all

## Rules

1. Every privileged endpoint requires an authenticated owner session.
2. Sessions must expire and support server-side revocation.
3. Login failures must be rate limited and audited.
4. Lock state must be enforced server-side, not only in JavaScript.
5. STOP ALL must fail closed when authentication, authorization, or service health is unavailable.
6. Every privileged action creates an audit record.
7. Secrets must live only in backend environment/secret storage.
8. Payment and payout providers remain provider-agnostic.
9. CORS must be restricted to the deployed control-center origin.
10. Production mode must never use the demo seed data.

## XKiss boundary

There are currently zero XKiss API calls, credentials, bindings, webhooks, repository dependencies, or deployment hooks.

A future XKiss connector must be a separate reviewed integration phase.
