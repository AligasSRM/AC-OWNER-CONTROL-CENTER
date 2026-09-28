# Integration Boundary

## Current state

AC-OWNER-CONTROL-CENTER is a standalone owner dashboard.

It does not connect to XKiss.

## Explicitly disconnected

- No XKiss repository dependency
- No shared source files
- No shared credentials
- No shared database
- No webhook
- No API client
- No deployment trigger
- No background connector

## Future integration rule

When the standalone Owner Control Center is finished and its backend/security is production-ready, an integration can be designed as a separate stage.

That future stage must define:

1. Authentication between systems.
2. Exact allowed commands.
3. Exact allowed read-only data.
4. Request signing/replay protection.
5. Timeouts and fail-closed behavior.
6. Audit records on both sides.
7. Kill switch and connector isolation.
8. Rollback and disconnect procedure.

Until then, the correct state is **DISCONNECTED BY DESIGN**.
