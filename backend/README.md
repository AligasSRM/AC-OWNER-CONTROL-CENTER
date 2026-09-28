# AC Owner Control Center — Backend

This backend is standalone and currently disconnected from XKiss.

## Local run

1. Copy `.env.example` to `.env` and set `OWNER_EMAIL`.
2. Generate a password hash with the local helper described in the security notes.
3. Put the hash into `OWNER_PASSWORD_HASH`.
4. Start with `node server.mjs`.

The server binds to `127.0.0.1` by default.

## Security behavior

- Owner password is never returned to the browser.
- Password verification uses Node scrypt.
- Sessions use random HttpOnly SameSite=Strict cookies.
- Production cookies add Secure.
- Login failures are rate limited.
- Privileged routes require an authenticated owner session.
- Server-side lock blocks privileged routes.
- STOP ALL is fail-closed and remains simulation-only while no services are connected.
- Audit records are stored locally for standalone development.
- No payment provider, payout provider, external API, webhook, or XKiss dependency exists.

This is the standalone backend foundation for local testing, not a claim of production deployment or production database durability.
