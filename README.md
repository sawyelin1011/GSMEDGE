# Edge Starter Kit

A multi-runtime, edge-ready full-stack starter kit designed for high performance and scalability. Build once, deploy anywhere.

## 🚀 Features

- **Edge Native**: Built on [Hono](https://hono.dev) and standard Web APIs. Runs on Cloudflare Workers, Deno Deploy, Vercel Edge, and Node.js.
- **Type Safe**: End-to-end type safety with [TypeScript](https://www.typescriptlang.org/), [Zod](https://zod.dev), and [Drizzle ORM](https://orm.drizzle.team).
- **Multi-Tenant Ready**: Built-in support for multi-tenancy (Tenants, Users, API Keys).
- **SQLite First**: Local development with SQLite, production-ready for edge databases (D1, Turso, Neon).
- **Monorepo Architecture**: Organized workspace structure for scaling applications and packages.

## 📚 Documentation

All documentation is located in the `.edge-stack/` directory:

- **[Quick Start](.edge-stack/index.md)**: Start here
- **[Tech Stack](.edge-stack/tech-stack.md)**: Libraries and tools used
- **[Architecture](.edge-stack/architecture.md)**: Project structure and patterns
- **[Coding Standards](.edge-stack/coding-standards.md)**: Best practices and conventions
- **[Workflows](.edge-stack/workflows.md)**: Step-by-step guides for common tasks
- **[Deployment](.edge-stack/deployment.md)**: Multi-runtime deployment guide

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env if needed (defaults work for local dev)
```

### 3. Initialize Database
```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`

### 5. Test the API
```bash
# Health check
curl http://localhost:5000/api/health

# Example route
curl http://localhost:5000/api/hello?name=Edge
```

## 🏗️ Project Structure

```
edge-starter/
├── apps/
│   └── api/               # Core API (platform-agnostic)
│       ├── src/           # Business logic (edge-compatible)
│       └── deploy/        # Runtime adapters (Cloudflare, Vercel, Deno, Node.js)
├── server/                # Development server (Node.js + Vite)
├── client/                # Frontend (React + Vite)
├── shared/                # Shared types and schemas
├── .edge-stack/           # Documentation and guidelines
└── package.json           # Workspace root
```

## 🚢 Deployment

This starter kit supports multiple runtimes out of the box:

- **Cloudflare Workers**: `apps/api/deploy/cloudflare.ts`
- **Vercel Edge**: `apps/api/deploy/vercel.ts`
- **Deno Deploy**: `apps/api/deploy/deno.ts`
- **Node.js**: `apps/api/deploy/node.ts`

See [Deployment Guide](.edge-stack/deployment.md) for detailed instructions.

## 🧪 Testing

Run TypeScript type checking:
```bash
npm run check
```

Run unit tests (example test included):
```bash
npm test
```

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Adding features while respecting edge constraints
- Code quality standards
- Testing requirements

## 🤖 AI Assistance

This project includes comprehensive documentation for AI coding assistants in `.edge-stack/`. Point your AI to `.edge-stack/index.md` for context-aware development.

## 📄 License

MIT License - see LICENSE file for details
