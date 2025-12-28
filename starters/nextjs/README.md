# Next.js Edge Starter

A production-ready Next.js 16 starter template with OpenNext for edge deployment. Deploy to Cloudflare Workers, Vercel Edge Functions, AWS Lambda, or traditional Node.js servers.

## 🚀 Features

- **Next.js 16** with App Router
- **OpenNext** for edge deployment
- **Multi-runtime support**: Cloudflare Workers, Vercel Edge, Node.js, AWS Lambda
- **SSR, SSG, and ISR** examples
- **React Server Components** by default
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Edge-compatible** API routes

## 📦 What's Included

```
starters/nextjs/
├── app/
│   ├── _components/       # Reusable components
│   ├── api/              # Next.js API routes
│   ├── blog/             # Blog with ISR example
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page (SSR)
│   └── globals.css       # Global styles
├── lib/                  # Utility functions
├── adapters/             # Runtime-specific adapters
├── next.config.ts        # Next.js configuration
├── open-next.config.ts   # OpenNext configuration
├── wrangler.jsonc        # Cloudflare Workers config
└── package.json
```

## 🎯 Rendering Strategies

### Server-Side Rendering (SSR)
**File**: `app/page.tsx`

Every request generates a fresh page on the server.

```tsx
export default async function Page() {
  const data = await fetchData(); // Runs on every request
  return <div>{data}</div>;
}
```

### Static Site Generation (SSG)
**File**: `app/blog/page.tsx`

Pages are pre-rendered at build time.

```tsx
export default async function Page() {
  const posts = await getBlogPosts(); // Runs at build time
  return <div>{posts.map(...)}</div>;
}
```

### Incremental Static Regeneration (ISR)
**File**: `app/blog/[slug]/page.tsx`

Static pages that regenerate in the background.

```tsx
export default async function Page({ params }) {
  const post = await getPost(params.slug);
  return <div>{post.content}</div>;
}

export const revalidate = 60; // Revalidate every 60 seconds
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

### Installation

```bash
# Clone or create from template
npx @edge/cli create my-app --template nextjs

# Navigate to project
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📝 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server (Node.js)
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Project Structure

- **`app/`** - Next.js App Router pages and layouts
- **`lib/`** - Utility functions and helpers
- **`public/`** - Static assets
- **`adapters/`** - Runtime-specific entry points

### Adding New Pages

1. Create a new file in `app/`:
   ```tsx
   // app/about/page.tsx
   export default function AboutPage() {
     return <div>About page</div>;
   }
   ```

2. Add navigation in `app/layout.tsx`:
   ```tsx
   <a href="/about">About</a>
   ```

### Adding API Routes

1. Create a new route handler:
   ```tsx
   // app/api/users/route.ts
   export async function GET() {
     return Response.json({ users: [] });
   }
   ```

2. Call from your components:
   ```tsx
   const response = await fetch('/api/users');
   const data = await response.json();
   ```

## 🚢 Deployment

### Cloudflare Workers

**Best for**: Global edge deployment with KV, R2, D1, and Durable Objects.

#### Setup

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Create required resources:
   ```bash
   # KV namespaces
   wrangler kv:namespace create "NEXT_CACHE"
   wrangler kv:namespace create "NEXT_TAG_CACHE"
   
   # R2 bucket
   wrangler r2 bucket create next-cache-bucket
   
   # D1 database
   wrangler d1 create next-revalidation
   ```

4. Update `wrangler.jsonc` with your IDs:
   ```jsonc
   {
     "account_id": "your-account-id",
     "kv_namespaces": [
       {
         "binding": "NEXT_CACHE",
         "id": "your-kv-id"
       }
     ]
   }
   ```

#### Deploy

```bash
# Build and deploy
npm run build:cloudflare
npm run deploy:cloudflare

# Or preview locally
npm run preview:cloudflare
```

#### Configuration

**`wrangler.jsonc`** - Cloudflare Workers configuration
- KV namespaces for caching
- R2 buckets for large cache items
- D1 database for revalidation queue
- Durable Objects for skew protection

**`open-next.config.ts`** - OpenNext configuration
- Cloudflare adapter settings
- Cache strategy
- Runtime options

### Vercel Edge Functions

**Best for**: Seamless deployment with zero configuration.

#### Setup

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

#### Deploy

```bash
# Deploy to production
npm run deploy:vercel

# Or use Vercel CLI
vercel --prod
```

Vercel automatically detects Next.js and configures everything for you.

### Node.js (Traditional)

**Best for**: Self-hosted deployments or platforms like Railway, Render, Fly.io.

#### Build

```bash
npm run build:node
```

#### Deploy

```bash
# Start production server
npm run start:node

# Or use PM2
pm2 start npm --name "nextjs-app" -- start
```

#### Environment Variables

Create `.env.production`:
```env
NODE_ENV=production
PORT=3000
```

### AWS Lambda (via OpenNext)

**Best for**: AWS infrastructure with Lambda and CloudFront.

#### Setup

1. Build for AWS:
   ```bash
   npm run build:aws
   ```

2. Deploy using AWS CDK or Serverless Framework:
   ```bash
   # Using Serverless Framework
   serverless deploy
   
   # Using AWS CDK
   cdk deploy
   ```

The `.open-next` directory contains the Lambda function code and assets.

## 🔧 Configuration

### Environment Variables

Create `.env.local` for development:

```env
# Public variables (exposed to browser)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Private variables (server-only)
DATABASE_URL=your-database-url
API_SECRET=your-secret-key
```

### Next.js Config

**`next.config.ts`** - Configure Next.js behavior:

```typescript
const nextConfig: NextConfig = {
  // Output mode
  output: 'standalone', // For Node.js
  
  // Image optimization
  images: {
    loader: 'custom', // For Cloudflare
  },
  
  // Headers, redirects, rewrites
  async headers() { ... },
};
```

### OpenNext Config

**`open-next.config.ts`** - Configure OpenNext adapter:

```typescript
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare-worker',
      incrementalCache: 'cloudflare-kv',
    },
  },
};
```

## 📚 Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

### OpenNext Resources

- [OpenNext Documentation](https://opennext.js.org/)
- [Cloudflare Adapter](https://opennext.js.org/cloudflare)
- [AWS Adapter](https://opennext.js.org/aws)

### Edge Computing

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Edge Runtime](https://edge-runtime.vercel.app/)

## 🐛 Troubleshooting

### Build Errors

**Error**: `Module not found: Can't resolve 'fs'`

**Solution**: Ensure you're not importing Node.js modules in client components or edge runtime code.

```tsx
// ❌ Wrong
import fs from 'fs';

// ✅ Correct (use Web APIs)
const response = await fetch('/api/data');
```

### Cloudflare Deployment Issues

**Error**: `KV namespace not found`

**Solution**: Create KV namespaces and update `wrangler.jsonc` with correct IDs:

```bash
wrangler kv:namespace create "NEXT_CACHE"
```

### ISR Not Working

**Issue**: Pages not revalidating

**Solution**: Ensure your runtime supports ISR:
- Cloudflare: Requires KV/R2 setup
- Vercel: Works automatically
- Node.js: Requires persistent storage

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🆘 Support

- [GitHub Issues](https://github.com/yourusername/edge-starter-kit/issues)
- [Discord Community](https://discord.gg/your-invite)
- [Documentation](https://docs.example.com)

---

**Built with ❤️ using Next.js 16 + OpenNext**
