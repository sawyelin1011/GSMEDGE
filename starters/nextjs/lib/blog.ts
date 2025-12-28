// Mock blog data - In a real app, this would fetch from a CMS or database
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
}

const mockPosts: BlogPost[] = [
  {
    slug: 'getting-started-with-nextjs-edge',
    title: 'Getting Started with Next.js on the Edge',
    excerpt: 'Learn how to deploy Next.js applications to edge runtimes like Cloudflare Workers.',
    content: `
      <h2>Introduction</h2>
      <p>Edge computing brings your application closer to your users, resulting in faster response times and better user experience.</p>
      
      <h2>Why Edge?</h2>
      <p>Edge runtimes like Cloudflare Workers run your code in data centers around the world, close to your users. This means:</p>
      <ul>
        <li>Lower latency</li>
        <li>Better performance</li>
        <li>Global scalability</li>
        <li>Cost-effective</li>
      </ul>
      
      <h2>Next.js + OpenNext</h2>
      <p>OpenNext enables you to deploy Next.js applications to edge runtimes that don't natively support Next.js.</p>
      
      <h2>Getting Started</h2>
      <pre><code>npm install
npm run build:cloudflare
npm run deploy:cloudflare</code></pre>
      
      <p>That's it! Your Next.js app is now running on the edge.</p>
    `,
    author: 'John Doe',
    date: '2025-01-15',
  },
  {
    slug: 'understanding-isr',
    title: 'Understanding Incremental Static Regeneration',
    excerpt: 'ISR combines the benefits of static generation with the flexibility of server-side rendering.',
    content: `
      <h2>What is ISR?</h2>
      <p>Incremental Static Regeneration (ISR) allows you to update static content without rebuilding your entire site.</p>
      
      <h2>How It Works</h2>
      <ol>
        <li>Pages are statically generated at build time</li>
        <li>After the revalidation period, the next request triggers a regeneration</li>
        <li>The stale page is served while regeneration happens in the background</li>
        <li>Once complete, the new page replaces the old one</li>
      </ol>
      
      <h2>Configuration</h2>
      <pre><code>export const revalidate = 60; // Revalidate every 60 seconds</code></pre>
      
      <h2>Benefits</h2>
      <ul>
        <li>Fast page loads (static)</li>
        <li>Fresh content (automatic updates)</li>
        <li>No need for full rebuilds</li>
        <li>Works great with edge runtimes</li>
      </ul>
    `,
    author: 'Jane Smith',
    date: '2025-01-14',
  },
  {
    slug: 'server-components-explained',
    title: 'React Server Components Explained',
    excerpt: 'Server Components are a new way to build React applications with better performance and user experience.',
    content: `
      <h2>What are Server Components?</h2>
      <p>Server Components are React components that run only on the server. They never send JavaScript to the client.</p>
      
      <h2>Benefits</h2>
      <ul>
        <li>Smaller bundle sizes</li>
        <li>Direct database access</li>
        <li>Better security (sensitive data stays on server)</li>
        <li>Improved performance</li>
      </ul>
      
      <h2>Client Components</h2>
      <p>Use the 'use client' directive for components that need interactivity:</p>
      <pre><code>'use client';

export function Counter() {
  const [count, setCount] = useState(0);
  return &lt;button onClick={() => setCount(count + 1)}&gt;{count}&lt;/button&gt;;
}</code></pre>
      
      <h2>Best Practices</h2>
      <ul>
        <li>Use Server Components by default</li>
        <li>Only use Client Components when you need interactivity</li>
        <li>Keep Client Components small and focused</li>
        <li>Pass serializable props between Server and Client Components</li>
      </ul>
    `,
    author: 'Bob Johnson',
    date: '2025-01-13',
  },
];

export async function getBlogPosts(): Promise<BlogPost[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockPosts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockPosts.find(post => post.slug === slug) || null;
}
