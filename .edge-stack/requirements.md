# Core Requirements

## Critical Constraints
- ✅ **Web Standard APIs ONLY**: `fetch`, `Request`, `Response`, `Headers`, `URL`, `crypto`, `TextEncoder`.
- ❌ **NO Node.js modules**: `fs`, `path`, `process`, `child_process`, `crypto` (node), etc.
- ✅ **Multi-runtime support**: Must run on Cloudflare Workers, Deno Deploy, Vercel Edge, Netlify Edge, Lambda@Edge.
- ✅ **Separation of Concerns**: Business logic in `/src/`, platform adapters in `/deploy/`.
- ✅ **Type Safety**: Zod validation + TypeScript strict mode.
- ✅ **Testing**: vitest with >80% coverage.

## Runtimes Supported
1. **Cloudflare Workers** - D1 database
2. **Deno Deploy** - SQLite backend
3. **Vercel Edge Functions** - Vercel KV
4. **Netlify Edge Functions** - Netlify config
5. **AWS Lambda@Edge** - DynamoDB/RDS

## Database Support
- SQLite (for edge)
- PostgreSQL (with Drizzle)
- MySQL (with Drizzle)
- D1 (Cloudflare)
- Neon (Serverless Postgres)

## Dependencies Philosophy
- ❌ **NO**: `fs`, `path`, `process`, `node:*`
- ✅ **YES**: `hono`, `zod`, `drizzle-orm`, `@hono/zod-validator`
- ✅ **Web APIs**: `fetch`, `Request`, `Response`, `Headers`, `URL`, `crypto`
