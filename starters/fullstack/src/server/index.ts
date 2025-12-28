import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import users from './routes/users';
import posts from './routes/posts';

// Environment bindings type (for Cloudflare Workers)
type Bindings = {
  DB?: any; // D1Database
  KV?: any; // KVNamespace
  R2?: any; // R2Bucket
};

// Create Hono app with typed bindings
const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: '*', // Configure for production
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', prettyJSON());

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: detectRuntime(),
  });
});

// API routes
app.route('/api/users', users);
app.route('/api/posts', posts);

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: c.req.path,
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message,
  }, 500);
});

// Detect runtime environment
function detectRuntime(): string {
  if (typeof globalThis.caches !== 'undefined' && 'default' in globalThis.caches) {
    return 'Cloudflare Workers';
  }
  if (typeof (globalThis as any).Deno !== 'undefined') {
    return 'Deno Deploy';
  }
  if (typeof process !== 'undefined' && process.versions?.node) {
    return `Node.js ${process.versions.node}`;
  }
  return 'Unknown Runtime';
}

export default app;
