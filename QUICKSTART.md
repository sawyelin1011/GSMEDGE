# YLSTACK Quick Start Guide

Get started with YLSTACK in under 5 minutes! 🚀

---

## Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- Basic knowledge of TypeScript and React

---

## Installation

### Option 1: Create New Project (Recommended)

```bash
# Using npx (no installation required)
npx @ylstack/cli create my-app

# Follow the interactive prompts:
# 1. Choose a template (fullstack, server-only, client-only, nextjs)
# 2. Select database type (SQLite, Turso, D1, PostgreSQL)
# 3. Choose runtime adapter (Cloudflare, Deno, Vercel, Node.js)
# 4. Wait for dependencies to install

cd my-app
npm run dev
```

### Option 2: Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/ylstack.git
cd ylstack

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Initialize database
npx @ylstack/cli db init

# Start development server
npm run dev
```

### Option 3: Global CLI Installation

```bash
# Install CLI globally
npm install -g @ylstack/cli

# Create new project
ylstack create my-app

# Navigate and start
cd my-app
ylstack dev
```

---

## First Steps

### 1. Configure Environment

Edit `.env` file to configure your database:

```env
# SQLite (Default - Best for local development)
DATABASE_TYPE=sqlite
DATABASE_URL=sqlite.db

# Server Configuration
PORT=5000
NODE_ENV=development

# Session Secret (CHANGE IN PRODUCTION!)
SESSION_SECRET=your-secret-key-here
```

### 2. Initialize Database

```bash
# Initialize database with schema
ylstack db init

# Or push schema changes directly (development)
ylstack db push
```

### 3. Start Development Server

```bash
# Start with default adapter (Node.js)
npm run dev

# Or use CLI directly
ylstack dev

# Visit http://localhost:5173
```

---

## Database Management

### Generate Migrations

```bash
# After changing schema in shared/schema.ts
ylstack db generate

# This creates migration files in ./migrations/
```

### Run Migrations

```bash
# Apply pending migrations
ylstack db migrate

# Migrations are tracked in the database
```

### Push Schema (Development Only)

```bash
# Directly sync schema to database (no migrations)
ylstack db push

# ⚠️ Use only in development - can cause data loss
```

### Seed Database

```bash
# Run seed script to populate initial data
ylstack db seed

# Edit server/seed.ts to customize seed data
```

### Open Drizzle Studio

```bash
# Launch visual database browser
ylstack db studio

# Opens at http://localhost:4983
```

### Check Database Configuration

```bash
# Verify database connection and settings
ylstack db check

# Shows:
# - Database type
# - Connection string
# - Runtime environment
# - Connection status
```

---

## Development Workflow

### 1. Add a New API Route

**Step 1**: Define schema in `shared/schema.ts`

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});
```

**Step 2**: Create route handler in `apps/api/src/routes/posts.ts`

```typescript
import { Hono } from 'hono';
import { posts } from '../../../../shared/schema';

const postsRouter = new Hono();

postsRouter.get('/', async (c) => {
  const db = c.get('db');
  const allPosts = await db.select().from(posts).all();
  return c.json(allPosts);
});

postsRouter.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json();
  
  const newPost = await db.insert(posts).values({
    title: body.title,
    content: body.content,
  }).returning();
  
  return c.json(newPost[0], 201);
});

export default postsRouter;
```

**Step 3**: Register route in `apps/api/src/index.ts`

```typescript
import postsRouter from './routes/posts';

app.route('/api/posts', postsRouter);
```

**Step 4**: Update database schema

```bash
# Generate migration
ylstack db generate

# Apply migration
ylstack db migrate

# Or push directly in dev
ylstack db push
```

### 2. Add a Frontend Page

**Step 1**: Create page component in `apps/client/src/pages/Posts.tsx`

```typescript
import { useState, useEffect } from 'react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);
  
  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

**Step 2**: Add route in `apps/client/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Posts from './pages/Posts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/posts" element={<Posts />} />
        {/* ... other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Switching Databases

### From SQLite to Turso

1. **Create Turso database**:
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Create database
   turso db create my-database
   
   # Get connection URL
   turso db show my-database --url
   
   # Create auth token
   turso db tokens create my-database
   ```

2. **Update `.env`**:
   ```env
   DATABASE_TYPE=turso
   DATABASE_URL=libsql://my-database-yourname.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   ```

3. **Migrate database**:
   ```bash
   ylstack db migrate
   ```

### From SQLite to Cloudflare D1

1. **Create D1 database**:
   ```bash
   npx wrangler d1 create my-database
   ```

2. **Update `wrangler.toml`**:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "my-database"
   database_id = "your-database-id"
   ```

3. **Update `.env`**:
   ```env
   DATABASE_TYPE=d1
   D1_DATABASE_ID=your-database-id
   ```

4. **Migrate database**:
   ```bash
   # Generate migration SQL
   ylstack db generate
   
   # Apply to D1
   npx wrangler d1 execute my-database --file=./migrations/0001_initial.sql
   ```

### From SQLite to PostgreSQL (Neon)

1. **Create Neon database**:
   - Visit https://neon.tech
   - Create new project
   - Copy connection string

2. **Update `.env`**:
   ```env
   DATABASE_TYPE=postgres
   DATABASE_URL=postgres://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

3. **Update schema dialect** in `shared/schema.ts`:
   ```typescript
   // Change from sqlite to pg
   import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
   
   export const posts = pgTable('posts', {
     id: serial('id').primaryKey(),
     title: text('title').notNull(),
     content: text('content').notNull(),
     createdAt: timestamp('created_at').notNull().defaultNow(),
   });
   ```

4. **Migrate database**:
   ```bash
   ylstack db generate --dialect postgresql
   ylstack db migrate
   ```

---

## Deployment

### Deploy to Cloudflare Workers

```bash
# Build for Cloudflare
ylstack build cloudflare

# Deploy
ylstack deploy cloudflare

# Or use wrangler directly
npx wrangler deploy
```

### Deploy to Vercel Edge

```bash
# Build for Vercel
ylstack build vercel

# Deploy
ylstack deploy vercel

# Or use Vercel CLI
npx vercel deploy
```

### Deploy to Deno Deploy

```bash
# Build for Deno
ylstack build deno

# Deploy
ylstack deploy deno

# Or use deployctl
deployctl deploy --project=my-project apps/api/deploy/deno.ts
```

### Deploy to Node.js (Docker)

```bash
# Build for Node.js
ylstack build node

# Build Docker image
docker build -t my-app .

# Run container
docker run -p 5000:5000 --env-file .env my-app
```

---

## Common Tasks

### Add New Dependency

```bash
# Add to root workspace
npm install <package>

# Add to specific app
npm install <package> -w apps/api
npm install <package> -w apps/client

# Add to specific package
npm install <package> -w packages/cli
```

### Run Type Check

```bash
# Check all packages
npm run check

# Check specific package
cd packages/cli && npm run type-check
```

### Build Project

```bash
# Build everything
npm run build

# Build specific package
cd packages/cli && npm run build
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific package tests
npm test -w packages/cli
```

---

## Troubleshooting

### Database Connection Errors

```bash
# Check database configuration
ylstack db check

# Verify environment variables
cat .env

# Test database connection
ylstack db push --dry-run
```

### Migration Errors

```bash
# Check pending migrations
ylstack db check

# Reset database (⚠️ DESTRUCTIVE)
rm sqlite.db
ylstack db init

# Generate fresh migrations
ylstack db generate
```

### Build Errors

```bash
# Clean build artifacts
rm -rf dist node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run type check
npm run check
```

### Port Already in Use

```bash
# Change port in .env
PORT=3001

# Or specify when running
PORT=3001 npm run dev
```

---

## Next Steps

1. **Read the Documentation**
   - [README.md](./README.md) - Full project documentation
   - [.edge-stack/](./.edge-stack/) - Architecture guides
   - [YLSTACK_TRANSFORMATION.md](./YLSTACK_TRANSFORMATION.md) - Transformation details

2. **Explore Examples**
   - Check `apps/api/src/routes/` for API examples
   - Check `apps/client/src/pages/` for frontend examples
   - Check `starters/` for different templates

3. **Join the Community**
   - GitHub Issues: Report bugs or request features
   - Discussions: Ask questions and share ideas
   - Discord: Chat with other developers

4. **Customize Your Project**
   - Update branding and styles
   - Add authentication
   - Integrate third-party services
   - Deploy to production

---

## Useful Commands Cheat Sheet

```bash
# Project Creation
ylstack create my-app                 # Create new project
ylstack create my-app -t fullstack    # With specific template
ylstack create my-app -a cloudflare   # With specific adapter

# Development
ylstack dev                           # Start dev server
ylstack dev --adapter deno            # With specific adapter
ylstack info                          # Show project info

# Database
ylstack db init                       # Initialize database
ylstack db generate                   # Generate migrations
ylstack db migrate                    # Run migrations
ylstack db push                       # Push schema (dev only)
ylstack db seed                       # Seed database
ylstack db studio                     # Open Drizzle Studio
ylstack db check                      # Check configuration

# Building & Deployment
ylstack build cloudflare              # Build for Cloudflare
ylstack build vercel                  # Build for Vercel
ylstack build deno                    # Build for Deno
ylstack build node                    # Build for Node.js
ylstack deploy cloudflare             # Deploy to Cloudflare
ylstack deploy vercel                 # Deploy to Vercel

# Maintenance
npm run check                         # Type check
npm run build                         # Build all packages
npm test                              # Run tests
npm run clean                         # Clean build artifacts
```

---

## Support

- **Documentation**: [README.md](./README.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ylstack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ylstack/discussions)

---

**Happy coding with YLSTACK!** 🚀
