# Architecture & Project Structure

## Monorepo Structure

```text
monorepo/
├── apps/
│   ├── api/
│   │   ├── src/          # ✅ Pure edge code (NO Node.js imports)
│   │   │   ├── routes/   # Hono route definitions
│   │   │   ├── handlers/ # Business logic
│   │   │   └── index.ts  # Main Hono app export
│   │   └── deploy/       # 🔌 Platform adapters
│   │       ├── cloudflare.ts
│   │       ├── deno.ts
│   │       ├── vercel.ts
│   │       └── ...
│   └── web/              # Frontend applications (Astro/Fresh)
├── packages/
│   ├── @edge/shared-types # Shared TypeScript interfaces
│   ├── @edge/validation   # Zod schemas
│   ├── @edge/db           # Drizzle schema & queries
│   ├── @edge/utils        # Pure utility functions
│   └── @edge/sdk          # Generated Client SDK
└── tools/                # Configs (eslint, tsconfig, etc.)
```

## Core Principles

### 1. Separation of Concerns
- **`/src/`**: Contains pure business logic. It **MUST NOT** import any platform-specific modules or Node.js built-ins. It should only use Web Standard APIs.
- **`/deploy/`**: Contains the "glue" code that adapts the pure Hono app to specific runtimes (Cloudflare, Vercel, Node.js, etc.). This is where environment variables are injected.

### 2. Dependency Injection via Context
- Do not access `process.env` directly in business logic.
- Environment variables should be passed via the Hono Context (`c.env`) or injected into services.

### 3. Shared Packages
- Reusable logic should be extracted to `packages/`.
- Packages must also be edge-compatible (no Node.js deps).

## Deployment Adapters
Each file in `apps/api/deploy/` imports the same `app` from `../src/index.ts` and wraps it for the target platform.

| Platform | Adapter File | Config File |
|----------|--------------|-------------|
| Cloudflare | `deploy/cloudflare.ts` | `wrangler.toml` |
| Deno Deploy | `deploy/deno.ts` | `deno.json` |
| Vercel Edge | `deploy/vercel.ts` | `vercel.json` |
| Netlify Edge | `deploy/netlify.ts` | `netlify.toml` |
| AWS Lambda@Edge | `deploy/lambda-edge.ts` | `sam.yaml` |
