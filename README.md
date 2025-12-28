# YLSTACK 🚀

> **Your Layer Stack - A production-ready, multi-runtime full-stack framework that runs everywhere**

Build once, deploy anywhere. YLSTACK provides a complete TypeScript full-stack framework with unified database management that runs seamlessly on Cloudflare Workers, Vercel Edge Functions, Deno Deploy, and Node.js - without changing a single line of business logic.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/Hono-4.0-orange.svg)](https://hono.dev/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## ✨ Features

- ⚡ **Multi-Runtime Support** - Deploy to Cloudflare Workers, Vercel Edge, Deno Deploy, or Node.js
- 🔒 **Edge-Compatible** - All business logic uses Web Standard APIs only
- 🎯 **Type-Safe** - End-to-end TypeScript with Zod validation
- 🗄️ **Unified Database Management** - SQLite, Turso, D1, PostgreSQL with single CLI
- 🛠️ **Powerful CLI** - `ylstack` CLI for database operations, migrations, and deployment
- 🔄 **Hot Module Replacement** - Fast development with Vite
- 📦 **Monorepo Structure** - Clear separation of concerns with workspace packages
- 🎨 **Modern Frontend** - React 18 with React Router
- 🛡️ **Input Validation** - Zod schemas for all API inputs
- 🚀 **Production Ready** - Docker support, health checks, migrations
- 🤖 **AI-Assisted Development** - Pre-configured for Cursor, Cline, Windsurf, Nao, Kiro, and more

---

## 🚦 Quick Start

### Create a New Project

```bash
# Using npx (recommended)
npx @ylstack/cli create my-app

# Or install globally
npm install -g @ylstack/cli
ylstack create my-app

# Follow the interactive prompts to choose:
# - Template (fullstack, server-only, client-only, nextjs)
# - Database (SQLite, Turso, D1, PostgreSQL)
# - Runtime adapter (Cloudflare, Deno, Vercel, Node.js)
```

### Manual Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd ylstack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Initialize database
ylstack db init

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your app running!

---

## 📁 Project Structure

```
ylstack/
├── packages/                       # 📦 Workspace packages
│   ├── cli/                        # 🛠️ @ylstack/cli
│   │   ├── src/
│   │   │   ├── commands/           # CLI commands
│   │   │   │   ├── db/             # Database commands
│   │   │   │   │   ├── generate.ts # Generate migrations
│   │   │   │   │   ├── migrate.ts  # Run migrations
│   │   │   │   │   ├── push.ts     # Push schema changes
│   │   │   │   │   ├── seed.ts     # Seed database
│   │   │   │   │   ├── studio.ts   # Launch Drizzle Studio
│   │   │   │   │   ├── check.ts    # Check database config
│   │   │   │   │   └── init.ts     # Initialize database
│   │   │   │   ├── create.ts       # Create new project
│   │   │   │   ├── dev.ts          # Development server
│   │   │   │   ├── build.ts        # Build for production
│   │   │   │   └── deploy.ts       # Deploy to platforms
│   │   │   └── index.ts            # CLI entry point
│   │   └── package.json
│   ├── database/                   # 🗄️ @ylstack/database
│   │   ├── src/
│   │   │   ├── adapters/           # Database adapters
│   │   │   │   └── index.ts        # Multi-runtime adapter factory
│   │   │   └── migrations/         # Migration utilities
│   │   │       └── runner.ts       # Migration runner
│   │   └── package.json
│   ├── core/                       # 🎯 @ylstack/core
│   ├── adapters/                   # 🔌 @ylstack/adapters
│   └── trpc-contracts/             # 📡 @ylstack/trpc-contracts
├── apps/
│   ├── api/                        # 📦 API application
│   │   ├── src/                    # 🌐 Platform-agnostic business logic
│   │   │   ├── index.ts            # Main Hono app
│   │   │   ├── types.ts            # AppEnv type definitions
│   │   │   ├── routes/             # API route handlers
│   │   │   │   ├── hello.ts        # Example: Hello World
│   │   │   │   └── todos.ts        # Example: CRUD operations
│   │   │   └── middleware/         # Custom middleware
│   │   ├── deploy/                 # 🚀 Platform-specific adapters
│   │   │   ├── cloudflare.ts       # Cloudflare Workers entry
│   │   │   ├── vercel-edge.ts      # Vercel Edge Functions entry
│   │   │   ├── deno.ts             # Deno Deploy entry
│   │   │   └── node.ts             # Node.js entry
│   │   └── package.json            # Package configuration
│   └── client/
│       └── src/                    # ⚛️ React frontend
│           ├── pages/              # Page components
│           │   ├── Dashboard.tsx   # Main dashboard
│           │   ├── Todos.tsx       # Todos example
│           │   └── NotFound.tsx    # 404 page
│           ├── components/         # Reusable components
│           ├── App.tsx             # Root component
│           └── main.tsx            # Entry point
├── starters/                       # 🎯 Starter templates
│   ├── fullstack/                  # Full-stack template
│   ├── server-only/                # API-only template
│   ├── client-only/                # Client-only template
│   └── nextjs/                     # Next.js template
├── server/                         # 🔧 Development server (Node.js)
│   ├── index.ts                    # Dev server with Vite
│   ├── db.ts                       # SQLite database setup
│   └── migrations/                 # Database migrations
├── shared/                         # 🔗 Shared code (legacy)
│   ├── routes.ts                   # API route contracts (Zod)
│   ├── schema.ts                   # Database schema (Drizzle)
│   └── types.ts                    # Shared TypeScript types
├── .edge-stack/                    # 📚 Project documentation
│   ├── index.md                    # Overview and quick start
│   ├── requirements.md             # Edge constraints (CRITICAL)
│   ├── architecture.md             # Project structure and patterns
│   ├── coding-standards.md         # Code style and conventions
│   ├── workflows.md                # Step-by-step guides
│   ├── deployment.md               # Runtime adapters and deployment
│   ├── checklist.md                # Pre-commit quality checks
│   ├── package-exports.md          # Monorepo package system guide
│   ├── deno-deploy.md              # Deno Deploy deployment guide
│   └── deno-deploy-checklist.md    # Deno Deploy checklist
├── .kiro/steering/                 # 🤖 AI steering configuration
│   ├── edge-compatibility.yaml     # Edge compatibility rules
│   ├── workflows.yaml              # Development workflows
│   ├── communication.yaml          # AI communication style
│   └── README.md                   # Kiro-specific documentation
├── test-packages.ts                # 🧪 Package import verification
├── deno.json                       # Deno configuration
├── AI_ASSISTANT_SETUP.md           # 🤖 Complete AI assistant guide
├── AI_CONFIGURATION_COMPLETE.md    # 📋 Configuration summary
├── VERIFICATION.md                 # ✅ Verification checklist
├── .cursorrules                    # Cursor AI configuration
├── .clinerules                     # Cline AI configuration
├── .windsurfrules                  # Windsurf AI configuration
├── .naorules                       # Nao AI configuration
├── .kirorules                      # Kiro AI configuration
├── .aiconfig                       # Generic AI configuration
├── .aidigestignore                 # AI context exclusions
├── CONTRIBUTING.md                 # Contribution guidelines
├── LICENSE                         # MIT License
├── Dockerfile                      # Docker configuration
├── .env.example                    # Environment variables template
└── package.json                    # Dependencies and scripts (workspace root)
```

### Key Directories Explained

| Directory | Purpose | Edge-Compatible? |
|-----------|---------|------------------|
| `apps/api/src/` | Platform-agnostic business logic | ✅ YES (Web Standards only) |
| `apps/api/deploy/` | Platform-specific adapters | ⚠️ Platform-specific |
| `packages/core/` | Core business logic (domain, services, policies) | ✅ YES (platform-agnostic) |
| `packages/adapters/` | Runtime adapters (Cloudflare, Deno, Node, Vercel) | ✅ YES (edge-compatible) |
| `packages/trpc-contracts/` | tRPC API contracts | ✅ YES (type-safe contracts) |
| `server/` | Development server | ❌ NO (Node.js only) |
| `shared/` | Type contracts and schemas (legacy) | ✅ YES (platform-agnostic) |
| `apps/client/` | React frontend | ✅ YES (browser APIs) |

---

## 🛠️ YLSTACK CLI

YLSTACK includes a powerful CLI for managing your project, database, and deployments.

### Installation

```bash
# Install globally
npm install -g @ylstack/cli

# Or use via npx
npx @ylstack/cli <command>
```

### Database Commands

```bash
# Initialize database with schema
ylstack db init

# Generate migrations from schema changes
ylstack db generate

# Run pending migrations
ylstack db migrate

# Push schema changes directly (dev only)
ylstack db push

# Seed database with initial data
ylstack db seed

# Open Drizzle Studio for database management
ylstack db studio

# Check database connection and configuration
ylstack db check
```

### Project Commands

```bash
# Create a new project
ylstack create my-app

# Start development server
ylstack dev

# Build for production
ylstack build [adapter]

# Deploy to platform
ylstack deploy [adapter]

# Display project information
ylstack info

# Setup project environment
ylstack setup
```

### Supported Databases

- **SQLite** - Local development (file or in-memory)
- **Turso** - Edge-compatible libSQL (production)
- **Cloudflare D1** - Cloudflare's edge SQL database
- **PostgreSQL** - Via Neon HTTP (edge-compatible)

---

## 📦 Monorepo Package System

This project uses **npm workspaces** to organize code into importable packages under the `@ylstack/*` namespace:

### Available Packages

| Package | Description | Import Example |
|---------|-------------|----------------|
| `@ylstack/cli` | CLI tool for database and project management | `npx @ylstack/cli db init` |
| `@ylstack/database` | Multi-runtime database adapters | `import { createDatabaseAdapter } from '@ylstack/database'` |
| `@ylstack/core` | Core business logic, domain models, services | `import { UserService } from '@ylstack/core/services/user-service'` |
| `@ylstack/trpc-contracts` | tRPC API contracts and router | `import { appRouter } from '@ylstack/trpc-contracts'` |
| `@ylstack/adapters` | Runtime adapters for all platforms | `import { DenoAdapter } from '@ylstack/adapters'` |

### Package Benefits

- ✅ **Type-safe imports** - All packages are TypeScript-first
- ✅ **Automatic linking** - npm workspace handles symlinks
- ✅ **Clear boundaries** - Enforced separation of concerns
- ✅ **Reusable code** - Share logic across apps
- ✅ **Edge-compatible** - All packages use Web Standards
- ✅ **Unified CLI** - Single tool for all operations

### Quick Package Usage

```typescript
// Import from workspace packages
import { createDatabaseAdapter } from '@ylstack/database';
import { UserService } from '@ylstack/core/services/user-service';
import { appRouter } from '@ylstack/trpc-contracts';
import { CloudflareAdapter } from '@ylstack/adapters';

// Use in your code
const userService = new UserService(db);
const user = await userService.findById('123');
```

**📚 Full Guide**: See [`.edge-stack/package-exports.md`](./.edge-stack/package-exports.md) for complete documentation.

---

## 🤖 AI Assistant Integration

This project comes pre-configured for **6+ AI coding assistants** with comprehensive rules and context:

- **Cursor** - `.cursorrules` (3,639 lines of configuration)
- **Cline** - `.clinerules` (full edge compatibility rules)
- **Windsurf** - `.windsurfrules` (workflow automation)
- **Nao** - `.naorules` (data engineering focus)
- **Kiro** - `.kirorules` + `.kiro/steering/` (YAML-based steering)
- **Generic** - `.aiconfig` (universal configuration)

### Getting Started with AI Assistants

1. **Read the setup guide**: [`AI_ASSISTANT_SETUP.md`](./AI_ASSISTANT_SETUP.md)
2. **Choose your assistant**: All major AI assistants are supported
3. **Start coding**: AI will enforce edge compatibility and best practices automatically

**Key AI Features**:
- 🚫 Prevents Node.js APIs in edge-compatible code
- ✅ Enforces Web Standard APIs
- 📝 Validates Zod schemas on all inputs
- 🔄 Guides through proper workflows
- 🎯 Maintains type safety across the stack

See [`AI_ASSISTANT_SETUP.md`](./AI_ASSISTANT_SETUP.md) for complete documentation.

---

## 📚 Documentation

### Core Documentation (`.edge-stack/`)

Start here to understand the project:

1. **[Overview](./.edge-stack/index.md)** - Project introduction and quick start
2. **[Requirements](./.edge-stack/requirements.md)** - Edge constraints (CRITICAL - read first!)
3. **[Architecture](./.edge-stack/architecture.md)** - Project structure and patterns
4. **[Coding Standards](./.edge-stack/coding-standards.md)** - Code style and conventions
5. **[Workflows](./.edge-stack/workflows.md)** - Step-by-step guides for common tasks
6. **[Deployment](./.edge-stack/deployment.md)** - Runtime adapters and deployment
7. **[Checklist](./.edge-stack/checklist.md)** - Pre-commit quality checks

### AI Configuration Documentation

- **[AI Assistant Setup](./AI_ASSISTANT_SETUP.md)** - Complete guide to AI-assisted development
- **[Configuration Summary](./AI_CONFIGURATION_COMPLETE.md)** - What's been configured
- **[Verification](./VERIFICATION.md)** - How to verify your setup

### Contributing

- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to this project

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with HMR (http://localhost:5173)
npm run dev:api          # Start API server only
npm run dev:client       # Start client only

# Database
npm run db:generate      # Generate Drizzle migrations
npm run db:push          # Push schema changes to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio (database GUI)

# Type Checking
npm run check            # Type check all packages
npm run check:api        # Type check API only
npm run check:client     # Type check client only

# Testing
npm test                 # Run all tests
npm run test:api         # Run API tests
npm run test:client      # Run client tests
npx tsx test-packages.ts # Verify package imports work

# Deno-specific (requires Deno installed)
deno task dev            # Start Deno dev server (http://localhost:8000)
deno task check          # Type check with Deno
deno task test           # Run Deno tests

# Building
npm run build            # Build for production
npm run build:api        # Build API only
npm run build:client     # Build client only

# Deployment
npm run deploy:cloudflare   # Deploy to Cloudflare Workers
npm run deploy:vercel       # Deploy to Vercel Edge
npm run deploy:deno         # Deploy to Deno Deploy
npm run deploy:node         # Deploy to Node.js server

# Docker
docker build -t edge-starter-kit .
docker run -p 3000:3000 edge-starter-kit
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database (Development)
DATABASE_URL=./server/db.sqlite

# Database (Production - choose one)
# DATABASE_URL=libsql://your-turso-db.turso.io
# DATABASE_URL=postgresql://your-neon-db.neon.tech
# CLOUDFLARE_D1_DATABASE_ID=your-d1-database-id

# API Configuration
API_PORT=3000
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:3000
```

---

## 📦 Tech Stack

### Backend

| Technology | Purpose | Edge-Compatible |
|------------|---------|-----------------|
| [Hono](https://hono.dev/) | Web framework | ✅ Yes |
| [Drizzle ORM](https://orm.drizzle.team/) | Type-safe database queries | ✅ Yes |
| [Zod](https://zod.dev/) | Runtime validation | ✅ Yes |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | SQLite driver (dev only) | ❌ No (Node.js) |

### Frontend

| Technology | Purpose |
|------------|---------|
| [React 18](https://reactjs.org/) | UI framework |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |

### Deployment Targets

| Platform | Runtime | Database Options |
|----------|---------|------------------|
| [Cloudflare Workers](https://workers.cloudflare.com/) | V8 isolates | D1, Turso |
| [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions) | V8 isolates | Turso, Neon HTTP |
| [Deno Deploy](https://deno.com/deploy) | Deno runtime | Turso, Neon HTTP |
| [Node.js](https://nodejs.org/) | Node.js | SQLite, PostgreSQL |

---

## 🚀 Deployment

### Cloudflare Workers

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create edge-starter-kit-db

# Update wrangler.toml with database ID
# Deploy
npm run deploy:cloudflare
```

### Vercel Edge Functions

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
npm run deploy:vercel
```

### Deno Deploy

```bash
# Install Deno
curl -fsSL https://deno.land/install.sh | sh

# Install deployctl
deno install --allow-all --no-check -r -f https://deno.land/x/deploy/deployctl.ts

# Deploy
npm run deploy:deno
```

### Node.js (Docker)

```bash
# Build Docker image
docker build -t edge-starter-kit .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=./db.sqlite \
  edge-starter-kit
```

See [`.edge-stack/deployment.md`](./.edge-stack/deployment.md) for detailed deployment instructions.

---

## 🚫 Critical Edge Constraints

**NEVER use these in `apps/api/src/`:**

```typescript
// ❌ Node.js built-in modules
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

// ❌ Node.js-specific APIs
process.env.NODE_ENV;
__dirname;
__filename;

// ❌ Native modules
import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
```

**ALWAYS use these instead:**

```typescript
// ✅ Web Standard APIs
crypto.randomUUID();
crypto.subtle.digest();
fetch('https://api.example.com');
new Request('https://example.com');
new Response('Hello', { status: 200 });

// ✅ Environment variables (via Hono context)
const apiKey = c.env.API_KEY;

// ✅ Database (via dependency injection)
const db = c.get('db');
```

See [`.edge-stack/requirements.md`](./.edge-stack/requirements.md) for complete edge compatibility rules.

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { app } from '../src/index';

describe('GET /api/hello', () => {
  it('returns hello message', async () => {
    const res = await app.request('/api/hello');
    expect(res.status).toBe(200);
    
    const json = await res.json();
    expect(json).toEqual({ message: 'Hello from Edge Starter Kit!' });
  });
});
```

---

## 🎯 Example: Adding a New Feature

Let's add a new `/api/users` endpoint:

### Step 1: Define Contract (`shared/routes.ts`)

```typescript
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.string().datetime()
});

export const userRoutes = {
  list: {
    method: 'GET' as const,
    path: '/api/users',
    responses: { 200: z.array(userSchema) }
  },
  create: {
    method: 'POST' as const,
    path: '/api/users',
    body: userSchema.omit({ id: true, createdAt: true }),
    responses: { 201: userSchema }
  }
};
```

### Step 2: Create Route Handler (`apps/api/src/routes/users.ts`)

```typescript
import { Hono } from 'hono';
import { userSchema } from '../../../shared/routes';
import { usersTable } from '../../../shared/schema';

const users = new Hono();

users.get('/', async (c) => {
  const db = c.get('db'); // Injected via context
  const results = await db.select().from(usersTable).all();
  return c.json(results);
});

users.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json();
  const validated = userSchema.omit({ id: true, createdAt: true }).parse(body);
  
  const newUser = {
    id: crypto.randomUUID(), // ✅ Web Standard API
    ...validated,
    createdAt: new Date().toISOString()
  };
  
  await db.insert(usersTable).values(newUser);
  return c.json(newUser, 201);
});

export default users;
```

### Step 3: Register Route (`apps/api/src/index.ts`)

```typescript
import users from './routes/users';

app.route('/api/users', users);
```

### Step 4: Add Database Table (`shared/schema.ts`)

```typescript
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').notNull()
});
```

### Step 5: Generate and Run Migration

```bash
npm run db:generate
npm run db:push
```

✅ Done! Your new endpoint is now available on all platforms.

See [`.edge-stack/workflows.md`](./.edge-stack/workflows.md) for more examples.

---

## 🔍 Troubleshooting

### Common Issues

**Issue**: `Cannot find module 'fs'` in edge deployment

**Solution**: You're using Node.js APIs in `apps/api/src/`. Move file operations to `server/` or use edge-compatible alternatives.

---

**Issue**: Database connection fails in production

**Solution**: Ensure you're using an edge-compatible database (D1, Turso, Neon HTTP) and have configured the correct `DATABASE_URL` environment variable.

---

**Issue**: Type errors after adding new route

**Solution**: Run `npm run check` to see detailed type errors. Ensure your Zod schema matches your database schema.

---

**Issue**: Hot reload not working

**Solution**: Restart the dev server with `npm run dev`. Check that you're editing files inside `apps/` directories.

---

## 🤝 Contributing

We welcome contributions! Please see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes (AI assistants will help enforce standards)
4. Run tests (`npm test`)
5. Run type check (`npm run check`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Quality Checklist

Before submitting a PR, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Type check passes (`npm run check`)
- [ ] No Node.js APIs in `apps/api/src/`
- [ ] All inputs validated with Zod
- [ ] Database accessed via context injection
- [ ] Documentation updated (if needed)
- [ ] AI configuration rules followed

See [`.edge-stack/checklist.md`](./.edge-stack/checklist.md) for the complete checklist.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - The ultrafast web framework for the Edge
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM that doesn't get in your way
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless execution environment
- [Vercel](https://vercel.com/) - Platform for frontend frameworks and static sites
- [Deno](https://deno.com/) - A modern runtime for JavaScript and TypeScript

---

## 📞 Support

- **Documentation**: Start with [`.edge-stack/index.md`](./.edge-stack/index.md)
- **AI Assistance**: See [`AI_ASSISTANT_SETUP.md`](./AI_ASSISTANT_SETUP.md)
- **Issues**: Open an issue on GitHub
- **Discussions**: Join our community discussions

---

## 🗺️ Roadmap

- [ ] Add authentication example (JWT, OAuth)
- [ ] Add WebSocket support
- [ ] Add file upload example (R2, S3)
- [ ] Add caching strategies (KV, Cache API)
- [ ] Add monitoring and observability
- [ ] Add rate limiting middleware
- [ ] Add API documentation (OpenAPI/Swagger)
- [ ] Add E2E testing examples (Playwright)
- [ ] Add CI/CD pipeline examples
- [ ] Add more deployment targets (AWS Lambda@Edge, Fastly Compute@Edge)

---

**Built with ❤️ for the Edge**

*Write once, run anywhere. No compromises.*