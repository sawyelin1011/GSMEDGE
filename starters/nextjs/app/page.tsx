import React, { Suspense } from 'react';
import { ServerTime } from './_components/ServerTime';
import { EdgeInfo } from './_components/EdgeInfo';

// This is a Server Component by default in App Router
export default async function HomePage() {
  // Simulate data fetching (runs on the server)
  const data = await fetchData();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Next.js Edge Starter
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">🚀 Features</h2>
          <ul className="space-y-2">
            <li>✅ Next.js 16 with App Router</li>
            <li>✅ OpenNext for edge deployment</li>
            <li>✅ Cloudflare Workers support</li>
            <li>✅ SSR, SSG, and ISR</li>
            <li>✅ TypeScript + Tailwind CSS</li>
            <li>✅ React Server Components</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">📦 Deployment</h2>
          <ul className="space-y-2">
            <li>🔷 Cloudflare Workers</li>
            <li>▲ Vercel Edge Functions</li>
            <li>🟢 Node.js</li>
            <li>☁️ AWS Lambda (via OpenNext)</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-blue-50 dark:bg-blue-900">
          <h3 className="text-xl font-semibold mb-2">Server-Side Rendering (SSR)</h3>
          <p className="mb-4">This page is rendered on the server for every request.</p>
          <React.Suspense fallback={<div>Loading server time...</div>}>
            <ServerTime />
          </React.Suspense>
        </div>

        <div className="p-6 border rounded-lg bg-green-50 dark:bg-green-900">
          <h3 className="text-xl font-semibold mb-2">Edge Runtime Information</h3>
          <p className="mb-4">Detecting runtime environment...</p>
          <EdgeInfo />
        </div>

        <div className="p-6 border rounded-lg bg-purple-50 dark:bg-purple-900">
          <h3 className="text-xl font-semibold mb-2">Fetched Data</h3>
          <p className="mb-2">Data fetched on the server:</p>
          <pre className="bg-white dark:bg-gray-800 p-4 rounded overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-8 p-6 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">🔗 Quick Links</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="/blog"
            className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <h4 className="font-semibold mb-2">Blog →</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ISR example with dynamic routes
            </p>
          </a>
          <a
            href="/api/hello"
            className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <h4 className="font-semibold mb-2">API Route →</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Next.js API route example
            </p>
          </a>
          <a
            href="https://github.com/yourusername/nextjs-edge-starter"
            className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h4 className="font-semibold mb-2">GitHub →</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View source code
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

// Simulate async data fetching
async function fetchData() {
  // In a real app, this would fetch from a database or API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    message: 'Hello from the server!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };
}

// Optional: Configure page metadata
export const metadata = {
  title: 'Home',
  description: 'Next.js Edge Starter - Deploy to Cloudflare Workers, Vercel Edge, and more',
};
