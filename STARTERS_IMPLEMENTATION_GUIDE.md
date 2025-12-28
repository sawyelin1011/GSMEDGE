# Edge Starter Kit - Complete Starters Implementation Guide

## 🎯 Overview

This guide provides complete implementation details for all 5 starter templates with proper Next.js 16 + OpenNext support, Hono backend integration, and multi-runtime deployment.

**Last Updated**: Based on Next.js v16.1.0, OpenNext.js latest, Hono v4.x

---

## 📦 Starter Templates Overview

### 1. **Fullstack** (`starters/fullstack/`)
- **Purpose**: Complete Hono API + React SPA
- **Frontend**: React 18 + Vite
- **Backend**: Hono with edge-compatible APIs
- **Database**: Drizzle ORM + SQLite (dev) / D1/Turso (prod)
- **Runtimes**: Cloudflare, Deno, Vercel, Node.js

### 2. **Next.js** (`starters/nextjs/`)
- **Purpose**: Next.js 16 App Router + OpenNext + Hono API
- **Frontend**: Next.js 16 with App Router (SSR, SSG, ISR)
- **Backend**: Hono API routes + Next.js API routes
- **Deployment**: OpenNext for Cloudflare Workers, Vercel Edge, AWS Lambda
- **Features**: Full SSR/SSG/ISR support, image optimization, middleware

### 3. **Server-Only** (`starters/server-only/`)
- **Purpose**: Pure API server (no frontend)
- **Backend**: Hono with full API capabilities
- **Use Case**: Microservices, API backends, webhooks
- **Runtimes**: All edge runtimes

### 4. **Client-Only** (`starters/client-only/`)
- **Purpose**: Static SPA (no backend)
- **Frontend**: React 18 + Vite
- **Deployment**: Static hosting (Cloudflare Pages, Vercel, Netlify)
- **Use Case**: Frontend-only apps consuming external APIs

### 5. **Vite-React** (`starters/vite-react/`)
- **Purpose**: Modern React SPA with minimal setup
- **Frontend**: React 18 + Vite + React Router
- **Features**: Fast HMR, optimized builds, modern tooling
- **Use Case**: Quick prototypes, SPAs

---

## 🚀 Priority 1: Next.js Starter (Most Complex)

### Directory Structure

```
starters/nextjs/
├── package.json                    # Dependencies and scripts
├── next.config.ts                  # Next.js configuration
├── open-next.config.ts             # OpenNext configuration
├── wrangler.jsonc                  # Cloudflare Workers config
├── vercel.json                     # Vercel Edge config
├── deno.json                       # Deno Deploy config
├── tsconfig.json                   # TypeScript config
├── .env.example                    # Environment variables
├── .cursorrules.nextjs             # AI rules for Next.js
├── README.md                       # Setup and deployment guide
├── .gitignore
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page (SSR)
│   ├── about/
│   │   └── page.tsx                # Static page (SSG)
│   ├── blog/
│   │   ├── page.tsx                # Blog list (ISR)
│   │   └── [slug]/
│   │       └── page.tsx            # Blog post (ISR)
│   ├── api/                        # Next.js API routes
│   │   └── hello/
│   │       └── route.ts            # API route example
│   └── _components/                # Shared components
│       ├── Header.tsx
│       └── Footer.tsx
├── hono-api/                       # Separate Hono API (optional)
│   ├── index.ts                    # Hono app entry
│   └── routes/
│       └── users.ts                # Hono routes
├── public/                         # Static assets
│   ├── favicon.ico
│   └── images/
├── shared/                         # Shared types and schemas
│   ├── schema.ts                   # Database schema (Drizzle)
│   └── types.ts                    # Shared TypeScript types
└── adapters/                       # Runtime adapters
    ├── cloudflare/
    │   └── worker.ts               # Cloudflare Worker entry
    ├── vercel/
    │   └── edge.ts                 # Vercel Edge entry
    └── node/
        └── server.ts               # Node.js server
```

### Key Files Implementation

#### 1. `package.json`

```json
{
  "name": "@edge/starter-nextjs",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    
    "build:cloudflare": "npx opennextjs-cloudflare build",
    "deploy:cloudflare": "npx opennextjs-cloudflare deploy",
    "preview:cloudflare": "wrangler dev",
    
    "build:vercel": "vercel build",
    "deploy:vercel": "vercel deploy --prod",
    
    "build:node": "next build && node adapters/node/server.ts",
    "start:node": "NODE_ENV=production node adapters/node/server.ts",
    
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "next": "^16.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "hono": "^4.6.0",
    "drizzle-orm": "^0.36.0",
    "@edge/core": "workspace:*",
    "@edge/adapters": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.6.0",
    "drizzle-kit": "^0.28.0",
    "@opennextjs/cloudflare": "^0.6.0",
    "wrangler": "^3.90.0",
    "vercel": "^39.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

#### 2. `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {
    // Enable Partial Prerendering (PPR)
    ppr: true,
    
    // Enable React Server Components
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
    // For Cloudflare Workers
    unoptimized: process.env.RUNTIME === 'cloudflare',
  },

  // Output configuration
  output: process.env.RUNTIME === 'cloudflare' ? 'standalone' : undefined,

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

#### 3. `open-next.config.ts` (OpenNext Configuration)

```typescript
import type { OpenNextConfig } from '@opennextjs/cloudflare';
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import kvTagCache from '@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';

const config: OpenNextConfig = defineCloudflareConfig({
  // Incremental cache using R2 for large cache items
  incrementalCache: r2IncrementalCache,
  
  // Tag cache using KV for fast revalidation
  tagCache: kvTagCache,
  
  // Queue for background revalidation
  queue: doQueue,
  
  // Enable cache interception for better performance
  enableCacheInterception: true,
  
  // Route preloading behavior
  routePreloadingBehavior: 'auto',
  
  // Skew protection for zero-downtime deployments
  cloudflare: {
    skewProtection: {
      enabled: true,
      maxNumberOfVersions: 20,
      maxVersionAgeDays: 7,
    },
  },
  
  // Cache purge strategy
  cachePurge: 'dummy', // Use 'dummy' for development, configure CDN for production
});

export default config;
```

#### 4. `wrangler.jsonc` (Cloudflare Workers Configuration)

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "edge-nextjs-starter",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": [
    "nodejs_compat",
    "global_fetch_strictly_public"
  ],

  // Static assets binding (required for Next.js)
  "assets": {
    "binding": "ASSETS",
    "directory": ".open-next/assets"
  },

  // Image optimization binding
  "images": {
    "binding": "IMAGES"
  },

  // Observability for monitoring
  "observability": {
    "enabled": true
  },

  // Environment variables
  "vars": {
    "NEXTJS_ENV": "production",
    "NEXT_INC_CACHE_KV_PREFIX": "cache",
    "NEXT_INC_CACHE_R2_PREFIX": "cache/",
    
    // Skew protection variables
    "CF_WORKER_NAME": "edge-nextjs-starter",
    "CF_PREVIEW_DOMAIN": "your-subdomain.workers.dev",
    "CF_WORKERS_SCRIPTS_API_TOKEN": "",
    "CF_ACCOUNT_ID": ""
  },

  // KV namespaces for caching
  "kv_namespaces": [
    {
      "binding": "NEXT_INC_CACHE_KV",
      "id": "production_kv_id",
      "preview_id": "preview_kv_id"
    },
    {
      "binding": "NEXT_TAG_CACHE_KV",
      "id": "tag_cache_kv_id"
    }
  ],

  // R2 buckets for large cache items
  "r2_buckets": [
    {
      "binding": "NEXT_INC_CACHE_R2_BUCKET",
      "bucket_name": "next-cache",
      "preview_bucket_name": "next-cache-preview"
    }
  ],

  // D1 database (optional, for tag cache)
  "d1_databases": [
    {
      "binding": "NEXT_TAG_CACHE_D1",
      "database_name": "tag-cache",
      "database_id": ""
    }
  ],

  // Durable Objects for advanced features
  "durable_objects": {
    "bindings": [
      {
        "name": "NEXT_CACHE_DO_QUEUE",
        "class_name": "DOQueueHandler",
        "script_name": "edge-nextjs-starter"
      },
      {
        "name": "NEXT_CACHE_DO_PURGE",
        "class_name": "BucketCachePurge",
        "script_name": "edge-nextjs-starter"
      },
      {
        "name": "NEXT_TAG_CACHE_DO_SHARDED",
        "class_name": "DOShardedTagCache",
        "script_name": "edge-nextjs-starter"
      }
    ]
  },

  // Service bindings
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "edge-nextjs-starter"
    }
  ]
}
```

#### 5. `app/layout.tsx` (Root Layout)

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Edge Starter Kit - Next.js',
  description: 'Next.js 16 with OpenNext and multi-runtime support',
  openGraph: {
    title: 'Edge Starter Kit',
    description: 'Production-ready Next.js starter',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Edge Starter</h1>
              <div className="space-x-4">
                <a href="/" className="hover:underline">Home</a>
                <a href="/about" className="hover:underline">About</a>
                <a href="/blog" className="hover:underline">Blog</a>
              </div>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t mt-8">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
            © 2025 Edge Starter Kit. Built with Next.js 16 + OpenNext.
          </div>
        </footer>
      </body>
    </html>
  );
}
```

#### 6. `app/page.tsx` (Home Page - SSR)

```typescript
import { Suspense } from 'react';

// Server Component with data fetching
async function ServerData() {
  // Fetch data on the server
  const res = await fetch('https://api.example.com/data', {
    // Revalidate every 60 seconds
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  const data = await res.json();
  
  return (
    <div className="bg-blue-50 p-4 rounded">
      <h2 className="font-bold mb-2">Server-Rendered Data</h2>
      <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// Loading fallback
function Loading() {
  return (
    <div className="bg-gray-100 p-4 rounded animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Edge Starter Kit
        </h1>
        <p className="text-lg text-gray-600">
          Next.js 16 with App Router, OpenNext, and multi-runtime support.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="space-y-2">
          <li>✅ Next.js 16 App Router</li>
          <li>✅ SSR, SSG, and ISR support</li>
          <li>✅ OpenNext for Cloudflare Workers</li>
          <li>✅ Vercel Edge Functions</li>
          <li>✅ TypeScript and Tailwind CSS</li>
          <li>✅ Drizzle ORM for databases</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Server-Side Rendering</h2>
        <Suspense fallback={<Loading />}>
          <ServerData />
        </Suspense>
      </section>
    </div>
  );
}
```

#### 7. `app/blog/[slug]/page.tsx` (Dynamic Route - ISR)

```typescript
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Type for blog post
interface BlogPost {
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
}

// Generate static params for ISR
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/blog/posts');
  const posts: BlogPost[] = await res.json();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

// Fetch post data
async function getPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`https://api.example.com/blog/posts/${slug}`, {
    // ISR: Revalidate every 3600 seconds (1 hour)
    next: { revalidate: 3600 },
  });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article className="prose lg:prose-xl mx-auto">
      <h1>{post.title}</h1>
      <time className="text-gray-500">
        {new Date(post.publishedAt).toLocaleDateString()}
      </time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

#### 8. `app/api/hello/route.ts` (API Route)

```typescript
import { NextRequest, NextResponse } from 'next/server';

// GET handler
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name') || 'World';
  
  return NextResponse.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  });
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Process data
    const result = {
      message: `Hello, ${body.name}!`,
      received: body,
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }
}

// Configure route
export const runtime = 'edge'; // Use edge runtime
export const dynamic = 'force-dynamic'; // Always dynamic
```

#### 9. `README.md` (Next.js Starter)

```markdown
# Edge Starter Kit - Next.js

Production-ready Next.js 16 starter with OpenNext and multi-runtime support.

## Features

- ✅ **Next.js 16** - Latest App Router with React 19
- ✅ **OpenNext** - Deploy to Cloudflare Workers, Vercel Edge, AWS Lambda
- ✅ **SSR/SSG/ISR** - Full rendering strategies support
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **Drizzle ORM** - Type-safe database queries
- ✅ **Edge Compatible** - Runs on any edge runtime

## Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Setup Environment

\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Cloudflare Workers

1. **Setup Wrangler**
\`\`\`bash
npm install -g wrangler
wrangler login
\`\`\`

2. **Create KV Namespaces**
\`\`\`bash
wrangler kv namespace create NEXT_INC_CACHE_KV
wrangler kv namespace create NEXT_TAG_CACHE_KV
\`\`\`

3. **Create R2 Bucket**
\`\`\`bash
wrangler r2 bucket create next-cache
\`\`\`

4. **Update wrangler.jsonc** with IDs from steps 2-3

5. **Build and Deploy**
\`\`\`bash
npm run build:cloudflare
npm run deploy:cloudflare
\`\`\`

### Vercel Edge

\`\`\`bash
npm install -g vercel
vercel login
npm run deploy:vercel
\`\`\`

### Node.js

\`\`\`bash
npm run build
npm run start:node
\`\`\`

## Project Structure

\`\`\`
app/              # Next.js App Router
├── layout.tsx    # Root layout
├── page.tsx      # Home page
├── about/        # Static pages
├── blog/         # Dynamic routes
└── api/          # API routes

shared/           # Shared types and schemas
adapters/         # Runtime adapters
public/           # Static assets
\`\`\`

## Rendering Strategies

### SSR (Server-Side Rendering)
\`\`\`typescript
// app/page.tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store', // Always fresh
  });
  return <div>{data}</div>;
}
\`\`\`

### SSG (Static Site Generation)
\`\`\`typescript
// app/about/page.tsx
export default function AboutPage() {
  // Statically generated at build time
  return <div>About Us</div>;
}
\`\`\`

### ISR (Incremental Static Regeneration)
\`\`\`typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  const post = await fetch(\`https://api.example.com/posts/\${params.slug}\`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  return <article>{post.content}</article>;
}
\`\`\`

## Database

### Generate Schema
\`\`\`bash
npm run db:generate
\`\`\`

### Run Migrations
\`\`\`bash
npm run db:migrate
\`\`\`

### Open Studio
\`\`\`bash
npm run db:studio
\`\`\`

## Environment Variables

\`\`\`env
# Public variables (exposed to browser)
NEXT_PUBLIC_API_URL=https://api.example.com

# Private variables (server-only)
DATABASE_URL=file:./sqlite.db
API_SECRET=your-secret-key

# Cloudflare Workers (for skew protection)
CF_WORKER_NAME=edge-nextjs-starter
CF_PREVIEW_DOMAIN=your-subdomain.workers.dev
CF_WORKERS_SCRIPTS_API_TOKEN=your-token
CF_ACCOUNT_ID=your-account-id
\`\`\`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenNext Documentation](https://opennext.js.org)
- [Cloudflare Workers](https://workers.cloudflare.com)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)

## License

MIT
\`\`\`

---

## 🎯 Priority 2: Fullstack Starter (Hono + React)

### Directory Structure

```
starters/fullstack/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── .cursorrules.fullstack
├── README.md
├── index.html
├── src/
│   ├── client/                     # React frontend
│   │   ├── main.tsx               # Client entry
│   │   ├── App.tsx                # Main component
│   │   ├── components/
│   │   └── lib/
│   ├── server/                     # Hono backend
│   │   ├── index.ts               # Server entry
│   │   ├── routes/
│   │   │   ├── users.ts
│   │   │   └── posts.ts
│   │   └── middleware/
│   └── adapters/                   # Runtime adapters
│       ├── cloudflare/
│       │   └── worker.ts
│       ├── deno/
│       │   └── server.ts
│       ├── vercel/
│       │   └── edge.ts
│       └── node/
│           └── server.ts
├── shared/                         # Shared contracts
│   ├── schema.ts                  # Database schema
│   └── routes.ts                  # API contracts
└── adapters/                       # Adapter configs
    ├── cloudflare/
    │   └── wrangler.toml
    ├── deno/
    │   └── deno.json
    ├── vercel/
    │   └── vercel.json
    └── node/
        └── ecosystem.config.js
```

### Key Files

#### `package.json`

```json
{
  "name": "@edge/starter-fullstack",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    
    "build:cloudflare": "vite build && wrangler deploy --dry-run",
    "deploy:cloudflare": "wrangler deploy",
    
    "build:deno": "vite build",
    "deploy:deno": "deployctl deploy --project=my-app src/adapters/deno/server.ts",
    
    "build:vercel": "vercel build",
    "deploy:vercel": "vercel deploy --prod",
    
    "build:node": "vite build && tsup src/adapters/node/server.ts",
    "start:node": "node dist/server.js",
    
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    
    "type-check": "tsc --noEmit",
    "lint": "eslint ."
  },
  "dependencies": {
    "@edge/core": "workspace:*",
    "@edge/adapters": "workspace:*",
    "hono": "^4.6.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "drizzle-orm": "^0.36.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "drizzle-kit": "^0.28.0",
    "wrangler": "^3.90.0",
    "tsup": "^8.3.0",
    "tailwindcss": "^3.4.0"
  }
}
```

#### `src/server/index.ts` (Hono API)

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import usersRoutes from './routes/users';
import postsRoutes from './routes/posts';

// Type for environment bindings
type Bindings = {
  DB: any; // D1 database or other
  ASSETS: any; // Static assets
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', logger());
app.use('*', cors());
app.use('*', prettyJSON());

// Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: c.env.RUNTIME || 'unknown',
  });
});

// API routes
app.route('/api/users', usersRoutes);
app.route('/api/posts', postsRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message,
  }, 500);
});

export default app;
```

#### `src/server/routes/users.ts`

```typescript
import { Hono } from 'hono';
import { z } from 'zod';

const users = new Hono();

// Validation schema
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// GET /api/users
users.get('/', async (c) => {
  // In production, fetch from database
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];
  
  return c.json(mockUsers);
});

// GET /api/users/:id
users.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  // Mock data
  const user = {
    id,
    name: 'John Doe',
    email: 'john@example.com',
  };
  
  return c.json(user);
});

// POST /api/users
users.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validated = userSchema.parse(body);
    
    // In production, save to database
    const newUser = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: new Date().toISOString(),
    };
    
    return c.json(newUser, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Validation failed',
        details: error.errors,
      }, 400);
    }
    throw error;
  }
});

export default users;
```

#### `src/client/App.tsx`

```typescript
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function HomePage() {
  const [health, setHealth] = useState<any>(null);
  
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth);
  }, []);
  
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">Edge Fullstack Starter</h1>
      <p className="text-gray-600">Hono API + React SPA</p>
      
      {health && (
        <div className="bg-green-50 p-4 rounded">
          <h2 className="font-bold">API Health</h2>
          <pre className="text-sm">{JSON.stringify(health, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers);
  }, []);
  
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Users</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded">
            <h3 className="font-bold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="font-bold text-xl">Edge Starter</Link>
              <Link to="/users" className="hover:underline">Users</Link>
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
```

#### `src/adapters/cloudflare/worker.ts`

```typescript
import app from '../../server';

// Cloudflare Workers entry point
export default {
  async fetch(request: Request, env: any, ctx: any) {
    return app.fetch(request, env, ctx);
  },
};
```

---

## 📝 CLI Integration

### Update `packages/cli/src/commands/create.ts`

Add template selection with proper paths:

```typescript
// Template configuration
const TEMPLATES = {
  fullstack: {
    name: 'Fullstack (Hono + React)',
    path: 'starters/fullstack',
    description: 'Complete app with Hono API and React SPA',
  },
  nextjs: {
    name: 'Next.js (App Router + OpenNext)',
    path: 'starters/nextjs',
    description: 'Next.js 16 with SSR/SSG/ISR support',
  },
  'server-only': {
    name: 'Server Only (Hono API)',
    path: 'starters/server-only',
    description: 'Pure API server without frontend',
  },
  'client-only': {
    name: 'Client Only (React SPA)',
    path: 'starters/client-only',
    description: 'Static SPA without backend',
  },
  'vite-react': {
    name: 'Vite + React',
    path: 'starters/vite-react',
    description: 'Modern React SPA with minimal setup',
  },
};
```

---

## 🎯 Next Steps

1. **Create Next.js starter** (Priority 1)
2. **Create Fullstack starter** (Priority 2)
3. **Create remaining starters** (Server-only, Client-only, Vite-React)
4. **Update CLI** to use local workspace packages
5. **Test all starters** with each runtime
6. **Write adapter-specific deployment guides**

---

## 📚 Resources

- [Next.js v16.1.0 Docs](https://nextjs.org/docs)
- [OpenNext.js Cloudflare](https://opennext.js.org/cloudflare)
- [Hono Documentation](https://hono.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [Cloudflare Workers](https://workers.cloudflare.com)

**Last Updated**: 2025-12-28
