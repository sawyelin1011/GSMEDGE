import { useEffect, useState } from 'react';

interface HealthStatus {
  status: string;
  timestamp: string;
  runtime: string;
}

export default function HomePage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch health status:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Welcome to Edge Fullstack Starter
      </h1>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            🚀 Features
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✅ Hono API (edge-compatible)</li>
            <li>✅ React 18 with Router</li>
            <li>✅ TypeScript + Zod validation</li>
            <li>✅ Tailwind CSS</li>
            <li>✅ Vite for fast builds</li>
            <li>✅ Multi-runtime support</li>
          </ul>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            📦 Deployment
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>🔷 Cloudflare Workers</li>
            <li>▲ Vercel Edge Functions</li>
            <li>🦕 Deno Deploy</li>
            <li>🟢 Node.js</li>
          </ul>
        </div>
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-900 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Server Status
        </h3>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : health ? (
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Status:</strong>{' '}
              <span className="text-green-600 dark:text-green-400">{health.status}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Runtime:</strong> {health.runtime}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-red-600 dark:text-red-400">Failed to fetch server status</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <a
          href="/users"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Users →
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users with full CRUD operations
          </p>
        </a>

        <a
          href="/posts"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Posts →
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage blog posts
          </p>
        </a>

        <a
          href="/about"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            About →
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Learn more about this starter
          </p>
        </a>
      </div>
    </div>
  );
}
