import { Hono } from 'hono';

// This is the Core API Application
// It is runtime-agnostic and uses Hono
// It will be mounted into the Node.js server via adapter

export const app = new Hono().basePath('/api');

// Simple logger middleware
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`[Hono] ${c.req.method} ${c.req.path} - ${c.res.status} (${ms}ms)`);
});

// Health Check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    runtime: 'node-adapter', // In a real edge deploy, this would come from env
    timestamp: new Date().toISOString()
  });
});

// Note: In a real monorepo this would be in apps/api/src/index.ts
// We export it here to be used by server/routes.ts
export default app;
