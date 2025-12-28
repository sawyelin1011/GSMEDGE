# Deployment Guide & Adapters

This project is designed to be **write once, run anywhere**. The core logic lives in `apps/api/src/` and is runtime-agnostic. We use **Adapters** in `apps/api/deploy/` to bind this logic to specific platforms.

## 📂 Adapter Locations

| Platform | Adapter File | Description |
|----------|--------------|-------------|
| **Cloudflare Workers** | `apps/api/deploy/cloudflare.ts` | Exports `fetch` handler. |
| **Vercel Edge** | `apps/api/deploy/vercel.ts` | Exports `GET`, `POST`, etc. using `hono/vercel`. |
| **Deno Deploy** | `apps/api/deploy/deno.ts` | Uses `Deno.serve()`. |
| **Node.js (Light)** | `apps/api/deploy/node.ts` | Uses `@hono/node-server` (Production). |
| **Express (Dev)** | `server/index.ts` | Uses `express` adapter (Development). |

## 🔄 How to Switch Adapters

You don't need to "switch" the code. You simply point your platform's configuration to the correct entry point.

### 1. Cloudflare Workers
Update `wrangler.toml`:
```toml
name = "my-edge-app"
main = "apps/api/deploy/cloudflare.ts"
compatibility_date = "2024-01-01"

[vars]
DATABASE_URL = "..."
```

### 2. Vercel
Update `vercel.json` (or set "Root Directory" in Vercel dashboard):
```json
{
  "functions": {
    "api/**": {
      "runtime": "edge",
      "entrypoint": "apps/api/deploy/vercel.ts"
    }
  }
}
```

### 3. Deno Deploy
Command line or `deno.json`:
```bash
deployctl deploy --project=my-project apps/api/deploy/deno.ts
```

### 4. Node.js (Docker/VPS)
For production Node.js deployment, avoid the `server/index.ts` (Express) used for dev. Use the lightweight adapter:

**Option A: Direct Node.js**
```bash
node apps/api/deploy/node.ts
```

**Option B: Docker**
See the included `Dockerfile` for a production-ready container setup:
```bash
docker build -t edge-starter .
docker run -p 5000:5000 -e DATABASE_URL=... edge-starter
```

## 🗄️ Database Considerations

When moving to Edge, you **MUST** swap the database driver in `server/db.ts` or inject it via context.

**Current Dev Setup (`server/db.ts`)**:
- Uses `better-sqlite3` (Local file).
- ❌ NOT compatible with Cloudflare/Vercel Edge.

**Edge Setup**:
1.  **Cloudflare D1**: Pass `env.DB` from the adapter to the Hono context.
2.  **Neon / Turso**: Use HTTP-based drivers (`@neondatabase/serverless` or `@libsql/client`).

### Example: Cloudflare D1 Injection
In `apps/api/deploy/cloudflare.ts`:
```typescript
import app from "../src/index";

export default {
  fetch: (req, env, ctx) => {
    // Inject DB into Hono Context
    app.context = { db: drizzle(env.DB) }; 
    return app.fetch(req, env, ctx);
  },
};
```
