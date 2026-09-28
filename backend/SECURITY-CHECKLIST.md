# Security & Production Checklist

## Owner authentication
- [ ] Server-side password hashing (Argon2id or equivalent)
- [ ] Secure, HttpOnly, SameSite session cookie
- [ ] Session expiration and revocation
- [ ] Login rate limiting
- [ ] Optional passkey/MFA
- [ ] No credentials in frontend source

## Authorization
- [ ] Owner role checked on every privileged endpoint
- [ ] STOP ALL requires explicit owner authorization
- [ ] Locked state enforced by backend
- [ ] Fail-closed behavior on auth or service failure

## Audit & monitoring
- [ ] Login success/failure audit
- [ ] Lock/unlock audit
- [ ] STOP ALL audit
- [ ] Payment/payout action audit
- [ ] Alert acknowledgement audit
- [ ] Health checks and latency monitoring

## Data protection
- [ ] TLS only
- [ ] Database backups
- [ ] Secret rotation
- [ ] No demo/test data in production
- [ ] No sensitive data in browser localStorage

## Deployment
- [ ] Backend deployed separately from GitHub Pages
- [ ] Production environment variables configured
- [ ] CORS restricted to the control-center origin
- [ ] Database migrations applied
- [ ] Smoke tests passed
- [ ] Recovery/rollback procedure tested

## Integration boundary
- [x] XKiss repository untouched
- [x] No XKiss credentials
- [x] No XKiss API calls
- [x] No XKiss deployment hooks
- [ ] Any future XKiss connector reviewed as a separate phase
