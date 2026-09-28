# AC-OWNER-CONTROL-CENTER

Private, mobile-first Owner Control Center.

## Build status

The independent control-room build is complete through the current standalone backend foundation.

### Completed build stages
2. Owner Security shell
3. Users monitoring
4. Videos monitoring
5. Views monitoring
6. Likes monitoring
7. Payments monitoring
8. Payouts monitoring
9. Live Activity / Events
10. Audit Log
11. Alerts
12. System Health
13. Mobile/PWA shell and offline asset cache
14. Local owner lock/unlock, audit state, module filters and safe STOP ALL simulation
15. Independent database test seed
16. Backend API contract
17. Security & production checklist
18. Hard integration boundary
19. Standalone backend runtime foundation and contract smoke test

## Current behavior

- GitHub Pages runs with clearly labeled independent test data.
- The frontend remains safe to use without a backend.
- Backend Stage 19 is a separate local runtime foundation; it is not deployed yet.
- Owner authentication uses a server-side password hash, HttpOnly SameSite session cookie, expiry, rate limiting, and server-side lock handling when the backend is configured.
- Privileged backend routes require an authenticated owner session.
- STOP ALL remains fail-closed and simulation-only while no services are connected.
- Backend audit records are stored locally for development.
- The PWA service worker provides a local/offline cache after the first successful load.
- No payment provider, payout provider, external API, webhook, or XKiss connection is active.

## Architecture

- Mobile-first frontend
- Independent normalized database schema
- Independent SQL test seed
- Standalone Node.js backend foundation using built-in runtime APIs
- Owner authentication and session contract
- Audit and alert tables
- Provider-agnostic payments/payouts
- PWA manifest and service worker
- Future XKiss integration is a separate phase and intentionally disconnected

## Safety rule

No XKiss repository files are required or modified by this project.

## Test data rule

All names, amounts, users, events, payment values and provider labels shown by the current Pages build are independent test/demo data. They are not live business data.

## Standalone completion boundary

Stages 16-19 establish the backend contract, security checklist, hard integration boundary, and a local backend foundation. The Owner Control Center remains standalone and **DISCONNECTED BY DESIGN** from XKiss until a future separately reviewed integration phase.

A backend deployment is not claimed until a real hosting/database environment is selected, configured, tested, and verified.
