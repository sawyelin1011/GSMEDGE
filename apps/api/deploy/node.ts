import { serve } from '@hono/node-server';
import app from '../src/index';

// Node.js Production Adapter (Lightweight)
// This uses @hono/node-server instead of Express for better performance
// when running in a standard Node.js container (Docker, VPS, etc.)

const port = parseInt(process.env.PORT || '3000', 10);

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
