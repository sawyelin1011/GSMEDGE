# Edge Fullstack Starter

A production-ready fullstack template that runs on **any edge runtime** - Cloudflare Workers, Vercel Edge, Deno Deploy, or Node.js.

## 🚀 Features

- **🌐 Multi-Runtime** - Deploy to Cloudflare, Vercel, Deno, or Node.js without code changes
- **⚡ Edge-First** - Built with Web Standards for maximum compatibility
- **🎨 Modern Stack** - React 18, Hono, TypeScript, Tailwind CSS
- **📦 Type-Safe** - End-to-end type safety with Zod validation
- **🗄️ Database Ready** - Drizzle ORM with SQLite (dev) or edge databases (prod)
- **🔥 Hot Reload** - Fast development with Vite HMR

## 📦 Tech Stack

### Backend
- **[Hono](https://hono.dev)** - Fast, lightweight web framework
- **[Drizzle ORM](https://orm.drizzle.team)** - Type-safe database queries
- **[Zod](https://zod.dev)** - Runtime type validation
- **SQLite** - Local development database

### Frontend
- **[React 18](https://react.dev)** - UI library with concurrent features
- **[React Router](https://reactrouter.com)** - Client-side routing
- **[Vite](https://vitejs.dev)** - Lightning-fast build tool
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first styling

## 🏗️ Project Structure

```
fullstack/
├── src/
│   ├── server/          # Backend API (edge-compatible)
│   │   ├── index.ts     # Hono app with middleware
│   │   └── routes/      # API route handlers
│   ├── client/          # React frontend
│   │   ├── pages/       # Page components
│   │   ├── main.tsx     # React entry point
│   │   └── index.css    # Global styles
│   └── adapters/        # Runtime-specific entry points
│       ├── cloudflare/  # Cloudflare Workers
│       ├── vercel/      # Vercel Edge Functions
│       ├── deno/        # Deno Deploy
│       └── node/        # Node.js server
├── shared/              # Shared types and schemas
├── public/              # Static assets
└── dist/                # Build output
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm, pnpm, or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server (frontend + backend)
npm run dev:client       # Start frontend only
npm run dev:server       # Start backend only

# Building
npm run build            # Build for production
npm run build:client     # Build frontend only
npm run build:server     # Build backend only

# Type checking & linting
npm run type-check       # Check TypeScript types
npm run lint             # Run ESLint
npm run format           # Format code with Prettier

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio
```

## 🌍 Deployment

### Cloudflare Workers

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run deploy:cloudflare
```

**Configuration**: Edit `wrangler.toml` with your account details.

### Vercel Edge Functions

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
npm run deploy:vercel
```

**Configuration**: Edit `vercel.json` for custom settings.

### Deno Deploy

```bash
# Install Deno
curl -fsSL https://deno.land/install.sh | sh

# Deploy via GitHub integration or CLI
deployctl deploy --project=your-project src/adapters/deno/mod.ts
```

**Configuration**: Edit `deno.json` for Deno-specific settings.

### Node.js (Traditional)

```bash
# Build the project
npm run build

# Start production server
npm run start:node
```

Deploy to any Node.js hosting platform (Railway, Fly.io, DigitalOcean, etc.).

## 🗄️ Database Setup

### Local Development (SQLite)

The starter uses SQLite for local development:

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate

# Open database GUI
npm run db:studio
```

### Production (Edge Databases)

For production, use edge-compatible databases:

#### Cloudflare D1
```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "your-database"
database_id = "your-database-id"
```

#### Turso (LibSQL)
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create my-database

# Get connection URL
turso db show my-database --url
```

#### Neon (Postgres)
```bash
# Create database at https://neon.tech
# Use HTTP connection string for edge compatibility
DATABASE_URL=https://your-project.neon.tech
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
# Development
NODE_ENV=development
PORT=3000
DATABASE_URL=./local.db

# Production (example)
DATABASE_URL=your-production-database-url
API_KEY=your-api-key
```

### TypeScript Paths

Path aliases are configured in `tsconfig.json`:

```typescript
import { api } from '@/server/routes';
import { Button } from '@client/components/Button';
import { schema } from '@shared/schema';
```

## 📚 API Routes

### Users API

```typescript
GET    /api/users       # List all users
POST   /api/users       # Create user
GET    /api/users/:id   # Get user by ID
PUT    /api/users/:id   # Update user
DELETE /api/users/:id   # Delete user
```

### Posts API

```typescript
GET    /api/posts       # List all posts
POST   /api/posts       # Create post
GET    /api/posts/:id   # Get post by ID
PUT    /api/posts/:id   # Update post
DELETE /api/posts/:id   # Delete post
```

## 🎨 Styling

This starter uses **Tailwind CSS** for styling. Customize the theme in `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#0ea5e9',
          // ... more shades
        },
      },
    },
  },
};
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔒 Security

- **CORS** - Configured for production origins
- **Rate Limiting** - Built-in middleware (configurable)
- **Input Validation** - Zod schemas on all API endpoints
- **Environment Variables** - Never committed to Git
- **Security Headers** - X-Frame-Options, CSP, etc.

## 📖 Learn More

### Documentation
- [Hono Documentation](https://hono.dev)
- [React Documentation](https://react.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

### Deployment Guides
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Deno Deploy](https://deno.com/deploy/docs)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Discord**: [Join our community](https://discord.gg/your-invite)

---

**Built with ❤️ for the edge computing era**
