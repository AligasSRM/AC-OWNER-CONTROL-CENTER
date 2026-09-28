# AC-OWNER-CONTROL-CENTER

Private, mobile-first Owner Control Center.

## Build status

The independent control-room build is complete through the current frontend foundation.

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

## Current behavior

- GitHub Pages runs with clearly labeled independent test data.
- Owner lock/unlock state is local to the browser and is **not** a real authentication system.
- STOP ALL is a UI safety simulation only; no production backend command is connected.
- Audit events created by the local UI are stored in browser local storage.
- The PWA service worker provides a local/offline cache after the first successful load.
- No payment provider, payout provider, external API, or XKiss connection is active.

## Architecture

- Mobile-first frontend
- Independent normalized database schema
- Independent SQL test seed
- Owner-only security model reserved for a future backend
- Audit and alert tables
- Provider-agnostic payments/payouts
- PWA manifest and service worker
- Future XKiss integration is a separate phase and intentionally disconnected

## Safety rule

No XKiss repository files are required or modified by this project.

## Test data rule

All names, amounts, users, events, payment values and provider labels shown by the current Pages build are independent test/demo data. They are not live business data.

## Next phase

Only after the independent control center is accepted as a standalone project should a separate backend/security deployment be considered. Any future XKiss connector must be designed and reviewed separately; it must not directly modify the XKiss repository from this frontend.


## Standalone completion boundary

Stages 16-18 establish the backend security contract, production security checklist, and a hard integration boundary. The Owner Control Center remains standalone and **DISCONNECTED BY DESIGN** from XKiss until a future separately reviewed integration phase.
