# Package Exports Guide

## Overview

The Edge Starter Kit uses an **npm workspace monorepo** structure with 4 internal packages that are importable as Node modules across all runtimes.

**Package Namespace**: `@edge/*`

---

## 📦 Available Packages

### 1. `@edge/core` - Core Business Logic

**Location**: `packages/core/`
**Purpose**: Platform-agnostic domain models, services, and policies

#### Exports

```typescript
// Types
import type { 
  AppEnv,
  RuntimeAdapter,
  DatabaseClient 
} from '@edge/core';

// Domain Models
import { User, Post, Comment } from '@edge/core/domain/user';
import { Product, Order } from '@edge/core/domain/product';

// Services
import { UserService } from '@edge/core/services/user-service';
import { AuthService } from '@edge/core/services/auth-service';

// Policies
import { canEditPost } from '@edge/core/policies/post-policy';
import { canViewUser } from '@edge/core/policies/user-policy';
```

#### File Structure
```
packages/core/
├── package.json
├── types.ts              # Core type definitions
├── domain/
│   ├── user.ts          # User domain models
│   └── product.ts       # Product domain models
├── services/
│   ├── user-service.ts  # User business logic
│   └── auth-service.ts  # Authentication logic
└── policies/
    ├── post-policy.ts   # Post authorization rules
    └── user-policy.ts   # User authorization rules
```

#### Usage Example
```typescript
// apps/api/src/routes/users.ts
import { UserService } from '@edge/core/services/user-service';
import type { User } from '@edge/core/domain/user';

const userService = new UserService(db);
const user: User = await userService.findById('123');
```

---

### 2. `@edge/trpc-contracts` - API Contracts

**Location**: `packages/trpc-contracts/`
**Purpose**: Type-safe API contracts using tRPC

#### Exports

```typescript
// Router
import { appRouter } from '@edge/trpc-contracts';
import type { AppRouter } from '@edge/trpc-contracts';

// Version constant
import { TRPC_CONTRACT_VERSION } from '@edge/trpc-contracts';
```

#### File Structure
```
packages/trpc-contracts/
├── package.json
└── router.ts            # tRPC router definition
```

#### Usage Example
```typescript
// Client-side
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@edge/trpc-contracts';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:5173/trpc',
    }),
  ],
});

// Server-side
import { appRouter } from '@edge/trpc-contracts';
import { createContext } from './context';

const trpcHandler = trpcServer({
  router: appRouter,
  createContext,
});
```

---

### 3. `@edge/adapters` - Runtime Adapters

**Location**: `packages/adapters/`
**Purpose**: Platform-specific adapters for different edge runtimes

#### Exports

```typescript
// Base adapter
import { BaseRuntimeAdapter } from '@edge/adapters';

// Platform-specific adapters
import { CloudflareAdapter } from '@edge/adapters';
import { DenoAdapter } from '@edge/adapters';
import { NodeAdapter } from '@edge/adapters';
import { VercelEdgeAdapter } from '@edge/adapters';
```

#### File Structure
```
packages/adapters/
├── package.json
├── base.ts              # Base adapter interface
├── cloudflare.ts        # Cloudflare Workers adapter
├── deno.ts              # Deno Deploy adapter
├── node.ts              # Node.js adapter
└── vercel-edge.ts       # Vercel Edge Functions adapter
```

#### Usage Example
```typescript
// apps/api/deploy/deno.ts
import { DenoAdapter } from '@edge/adapters';
import { app } from '../src/index.ts';

const adapter = new DenoAdapter(app);
export default adapter.serve();
```

---

### 4. `@edge/api` - API Application

**Location**: `apps/api/`
**Purpose**: Main Hono application with routes and middleware

#### Exports

```typescript
// Main app
import { app } from '@edge/api';

// Deployment adapters
import cloudflareHandler from '@edge/api/deploy/cloudflare';
import denoHandler from '@edge/api/deploy/deno';
import nodeHandler from '@edge/api/deploy/node';
import vercelHandler from '@edge/api/deploy/vercel-edge';

// Types
import type { AppEnv } from '@edge/api';
```

#### File Structure
```
apps/api/
├── package.json
├── src/
│   ├── index.ts         # Main Hono app
│   ├── types.ts         # Type definitions
│   └── routes/
│       ├── hello.ts     # Example routes
│       └── health.ts
└── deploy/
    ├── cloudflare.ts    # Cloudflare Workers entry
    ├── deno.ts          # Deno Deploy entry
    ├── node.ts          # Node.js entry
    └── vercel-edge.ts   # Vercel Edge entry
```

#### Usage Example
```typescript
// Extending the API
import { app } from '@edge/api';
import { Hono } from 'hono';

const customRoutes = new Hono();
customRoutes.get('/custom', (c) => c.json({ message: 'Custom route' }));

app.route('/api/custom', customRoutes);
```

---

## 🔧 Workspace Configuration

### Root `package.json`

```json
{
  "name": "edge-starter-kit",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "vite",
    "build": "npm run build:client && npm run build:server",
    "check": "tsc --noEmit"
  }
}
```

### Package `package.json` Template

```json
{
  "name": "@edge/package-name",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./index.ts",
    "./subpath/*": "./subpath/*.ts"
  },
  "dependencies": {
    "@edge/other-package": "*"
  }
}
```

**Key Points**:
- ✅ `"type": "module"` - Use ES modules
- ✅ `"exports"` - Define public API surface
- ✅ `"*"` version - npm workspace auto-resolves local packages
- ✅ `.ts` extensions - Direct TypeScript imports (modern approach)

---

## 📥 Installation & Setup

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd edge-starter-kit

# Install all dependencies (includes workspace linking)
npm install
```

**What happens**:
1. npm installs external dependencies
2. npm creates symlinks in `node_modules/@edge/` pointing to local packages
3. All packages become importable as `@edge/*`

### Verify Installation

```bash
# Run package import test
npx tsx test-packages.ts

# Expected output:
# ✅ All packages are properly configured and importable!
```

---

## 🔄 Development Workflow

### Adding a New Package

**Step 1**: Create package directory
```bash
mkdir -p packages/new-package
```

**Step 2**: Create `package.json`
```json
{
  "name": "@edge/new-package",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./index.ts"
  }
}
```

**Step 3**: Create entry point
```typescript
// packages/new-package/index.ts
export const myFunction = () => {
  return 'Hello from new package';
};
```

**Step 4**: Reinstall workspace
```bash
npm install
```

**Step 5**: Import in other packages
```typescript
import { myFunction } from '@edge/new-package';
```

### Adding Dependencies Between Packages

**Example**: `@edge/api` depends on `@edge/core`

```json
// apps/api/package.json
{
  "name": "@edge/api",
  "dependencies": {
    "@edge/core": "*",
    "@edge/adapters": "*",
    "hono": "^4.0.0"
  }
}
```

**Rules**:
- ✅ Use `"*"` for workspace packages
- ✅ Use specific versions for external packages
- ✅ Run `npm install` after changes

### Updating Package Exports

**Example**: Add new export path to `@edge/core`

```json
// packages/core/package.json
{
  "exports": {
    ".": "./types.ts",
    "./domain/*": "./domain/*.ts",
    "./services/*": "./services/*.ts",
    "./policies/*": "./policies/*.ts",
    "./utils/*": "./utils/*.ts"  // ← New export
  }
}
```

**Usage**:
```typescript
import { formatDate } from '@edge/core/utils/date';
```

---

## 🎯 Import Patterns

### ✅ Correct Patterns

```typescript
// Import from workspace packages
import { UserService } from '@edge/core/services/user-service';
import { appRouter } from '@edge/trpc-contracts';
import { CloudflareAdapter } from '@edge/adapters';

// Import types
import type { AppEnv } from '@edge/core';
import type { User } from '@edge/core/domain/user';

// Import with subpaths
import { canEditPost } from '@edge/core/policies/post-policy';
```

### ❌ Incorrect Patterns

```typescript
// ❌ Don't use relative paths for workspace packages
import { UserService } from '../../../packages/core/services/user-service';

// ❌ Don't import from non-exported paths
import { internalHelper } from '@edge/core/internal/helper';

// ❌ Don't use workspace: protocol (pnpm-specific)
"dependencies": {
  "@edge/core": "workspace:*"
}
```

---

## 🚀 Runtime Compatibility

### All Packages Must Be Edge-Compatible

**Forbidden in `@edge/*` packages**:
- ❌ Node.js built-ins (`fs`, `path`, `crypto`)
- ❌ Native modules (`better-sqlite3`, `bcrypt`)
- ❌ `process.env` (use context injection)
- ❌ `__dirname`, `__filename`

**Allowed in `@edge/*` packages**:
- ✅ Web Standard APIs (`fetch`, `crypto.randomUUID()`)
- ✅ Platform-agnostic libraries (`zod`, `hono`)
- ✅ TypeScript/JavaScript only

**Exception**: `apps/api/deploy/*` can use Node.js APIs (adapter layer)

### Testing Edge Compatibility

```bash
# Deno (strictest edge runtime)
deno task check

# TypeScript
npm run check

# Build (esbuild will warn about incompatible modules)
npm run build
```

---

## 📊 Package Dependency Graph

```
@edge/api
  ├── @edge/core
  ├── @edge/adapters
  │     └── @edge/core (optional)
  └── @edge/trpc-contracts
        └── @edge/core

@edge/core
  └── (no internal dependencies)

@edge/adapters
  └── (no internal dependencies)

@edge/trpc-contracts
  └── @edge/core
```

**Rules**:
- ✅ `@edge/core` has no internal dependencies (foundation)
- ✅ `@edge/adapters` is independent (can be used standalone)
- ✅ `@edge/api` depends on all packages (application layer)
- ✅ No circular dependencies allowed

---

## 🔍 Troubleshooting

### Package Not Found

**Error**: `Cannot find module '@edge/core'`

**Solutions**:
1. Run `npm install` to create workspace links
2. Check `package.json` has correct `"workspaces"` field
3. Verify package has `package.json` with `"name": "@edge/core"`
4. Check `node_modules/@edge/core` symlink exists

### Import Resolution Issues

**Error**: `Module not found: Can't resolve '@edge/core/services/user-service'`

**Solutions**:
1. Check `exports` field in package's `package.json`
2. Verify file exists at specified path
3. Use `.ts` extension in exports: `"./services/*": "./services/*.ts"`
4. Restart TypeScript server in IDE

### Type Errors

**Error**: `Could not find a declaration file for module '@edge/core'`

**Solutions**:
1. Ensure package exports `.ts` files (not `.js`)
2. Check `tsconfig.json` includes workspace packages
3. Run `npm run check` to verify types
4. Restart IDE/TypeScript server

### Circular Dependencies

**Error**: Build hangs or crashes

**Solutions**:
1. Review dependency graph (see above)
2. Move shared types to `@edge/core`
3. Use dependency injection instead of direct imports
4. Refactor to remove circular references

---

## 📚 Best Practices

### 1. Package Boundaries

**Do**:
- ✅ Keep `@edge/core` pure and platform-agnostic
- ✅ Put runtime-specific code in `@edge/adapters`
- ✅ Define API contracts in `@edge/trpc-contracts`
- ✅ Keep business logic separate from HTTP handlers

**Don't**:
- ❌ Import from `@edge/api` in `@edge/core`
- ❌ Put business logic in adapters
- ❌ Mix platform-specific code in core packages

### 2. Export Management

**Do**:
- ✅ Explicitly define exports in `package.json`
- ✅ Use subpath exports for organization
- ✅ Export types separately with `type` keyword
- ✅ Document all public APIs

**Don't**:
- ❌ Export internal utilities
- ❌ Use wildcard exports (`export * from './internal'`)
- ❌ Change exports without updating consumers

### 3. Versioning

**Do**:
- ✅ Use `"*"` for workspace dependencies
- ✅ Keep versions in sync across packages
- ✅ Document breaking changes
- ✅ Use semantic versioning if publishing

**Don't**:
- ❌ Pin specific versions for workspace packages
- ❌ Make breaking changes without major version bump
- ❌ Forget to update dependent packages

### 4. Testing

**Do**:
- ✅ Test package imports with `test-packages.ts`
- ✅ Run `npm run check` before committing
- ✅ Test in multiple runtimes (Deno, Node, Cloudflare)
- ✅ Verify build output

**Don't**:
- ❌ Assume imports work without testing
- ❌ Skip type checking
- ❌ Ignore build warnings

---

## 🎓 Learning Resources

- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Package Exports](https://nodejs.org/api/packages.html#exports)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Monorepo Best Practices](https://monorepo.tools/)

---

## 📝 Quick Reference

### Common Commands

```bash
# Install all packages
npm install

# Test package imports
npx tsx test-packages.ts

# Type check all packages
npm run check

# Build all packages
npm run build

# Run dev server
npm run dev

# Deno-specific
deno task dev
deno task check
```

### Import Cheat Sheet

```typescript
// Core types
import type { AppEnv, User } from '@edge/core';

// Services
import { UserService } from '@edge/core/services/user-service';

// Policies
import { canEditPost } from '@edge/core/policies/post-policy';

// tRPC
import { appRouter } from '@edge/trpc-contracts';
import type { AppRouter } from '@edge/trpc-contracts';

// Adapters
import { CloudflareAdapter } from '@edge/adapters';

// API
import { app } from '@edge/api';
```

### File Locations

| Package | Location | Entry Point |
|---------|----------|-------------|
| @edge/core | `packages/core/` | `types.ts` |
| @edge/trpc-contracts | `packages/trpc-contracts/` | `router.ts` |
| @edge/adapters | `packages/adapters/` | `base.ts` |
| @edge/api | `apps/api/` | `src/index.ts` |

---

**Last Updated**: 2025-01-27
**Version**: 1.0.0
