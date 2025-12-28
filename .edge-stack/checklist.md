# Checklists

## ✅ Pre-Generation / Planning
- [ ] Is this logic for `/src/` (pure) or `/deploy/` (adapter)?
- [ ] Does it require external APIs?
- [ ] Does it need database queries?
- [ ] What validation rules apply?

## ✅ Post-Generation / Review
- [ ] **No Node.js imports** (`fs`, `path`, `process`).
- [ ] **No `process.env` usage** in business logic.
- [ ] **Zod validation** applied to all inputs.
- [ ] **Error handling** implemented (try-catch).
- [ ] **JSDoc comments** added to exports.
- [ ] **Tests included** (>80% coverage).
- [ ] **Types** are explicit (no `any`).
- [ ] **Works on all runtimes** (Cloudflare, Deno, Vercel, etc.).

## 🔒 Security Checklist
- [ ] Validate ALL inputs with Zod.
- [ ] Hash sensitive data (using `crypto.subtle`).
- [ ] Use HTTPS only.
- [ ] Set security headers (HSTS, CSP, X-Frame-Options).
- [ ] CORS properly configured.
- [ ] Rate limiting on public endpoints.
- [ ] No sensitive data in logs.
- [ ] Authentication tokens in headers, not cookies (for APIs).
- [ ] SQL queries use parameterization (Drizzle handles this).
