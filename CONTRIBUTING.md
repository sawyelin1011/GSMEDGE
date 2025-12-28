# Contributing to Edge Starter Kit

Thank you for your interest in contributing! This guide will help you add features while respecting the edge-first architecture.

## Core Principles

### 1. **Edge-First Design**
- Use only Web Standard APIs (fetch, Request, Response, URL, etc.)
- Avoid Node.js-specific APIs (fs, path, crypto.randomBytes, etc.)
- Test your code works in multiple runtimes (Node.js, Deno, Cloudflare Workers)

### 2. **Separation of Concerns**
- **`apps/api/src/`**: Platform-agnostic business logic (pure Hono app)
- **`apps/api/deploy/`**: Platform-specific adapters (entry points only)
- Never import Node.js APIs in `/src/` - keep them in `/deploy/` if needed

### 3. **Type Safety**
- Use Zod for runtime validation
- Define schemas in `shared/` for client-server contracts
- Run `npm run check` before committing

## Development Workflow

### Adding a New API Route

1. **Define the contract** in `shared/routes.ts`:
```typescript
export const myFeatureRoutes = {
  getItems: {
    method: "GET",
    path: "/api/items",
    responses: {
      200: z.array(z.object({ id: z.string(), name: z.string() }))
    }
  }
} as const;
```

2. **Implement in** `apps/api/src/index.ts`:
```typescript
app.get('/items', async (c) => {
  const items = await db.select().from(itemsTable);
  return c.json(items);
});
```

3. **Test locally**:
```bash
npm run dev
curl http://localhost:5000/api/items
```

### Adding Database Tables

1. **Update schema** in `shared/schema.ts`:
```typescript
export const itemsTable = sqliteTable('items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString())
});
```

2. **Generate migration**:
```bash
npm run db:generate
```

3. **Apply migration**:
```bash
npm run db:migrate
```

### Adding a New Runtime Adapter

1. **Create** `apps/api/deploy/my-platform.ts`:
```typescript
import app from '../src/index';

// Platform-specific entry point
export default {
  fetch: app.fetch
};
```

2. **Update** `apps/api/package.json` exports:
```json
{
  "exports": {
    "./deploy/my-platform": "./deploy/my-platform.ts"
  }
}
```

3. **Document** in `.edge-stack/deployment.md`

## Code Quality Checklist

Before submitting a PR, verify:

- [ ] `npm run check` passes (TypeScript)
- [ ] `npm run dev` starts without errors
- [ ] No Node.js APIs in `apps/api/src/`
- [ ] All routes have Zod validation
- [ ] Database queries use Drizzle ORM
- [ ] Environment variables have defaults or clear error messages
- [ ] New features documented in `.edge-stack/`

## Testing

### Manual Testing
```bash
# Start dev server
npm run dev

# Test endpoint
curl http://localhost:5000/api/your-endpoint
```

### Automated Testing (Future)
We plan to add Vitest for unit tests. Example structure:
```
apps/api/src/__tests__/
  ├── routes.test.ts
  └── db.test.ts
```

## Security Guidelines

1. **Never commit secrets**: Use `.env` (gitignored) for sensitive data
2. **Validate all inputs**: Use Zod schemas for request validation
3. **Sanitize database queries**: Use Drizzle's parameterized queries (never string concatenation)
4. **Rate limiting**: Consider adding rate limiting middleware for production

## Getting Help

- **Documentation**: See `.edge-stack/` for architecture and standards
- **Issues**: Check existing issues or open a new one
- **Discussions**: Use GitHub Discussions for questions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
