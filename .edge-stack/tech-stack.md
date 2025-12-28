# Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | **Hono** | Ultralight (3KB), WinterCG native, standard Web API based. |
| **Validation** | **Zod** | Runtime type safety, schema inference. |
| **ORM** | **Drizzle** | SQL-agnostic, edge-compatible, lightweight. |
| **Package Manager** | **pnpm** | Fast, monorepo-friendly. |
| **Build System** | **Turborepo** | Task caching, parallelization. |
| **Bundler** | **tsup** | Zero-config TypeScript bundler. |
| **Testing** | **vitest** | Fast, ESM-native test runner. |
| **Linting** | **Biome** | Fast linter + formatter (ESLint + Prettier replacement). |

## Key Libraries
- `@hono/zod-validator`: Middleware for validating Hono requests with Zod.
- `@edge/*`: Internal shared packages.

## Documentation References
- [Hono Docs](https://hono.dev)
- [Zod Docs](https://zod.dev)
- [Drizzle Docs](https://orm.drizzle.team)
- [WinterCG](https://wintercg.org)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build)
- [Biome](https://biomejs.dev)
