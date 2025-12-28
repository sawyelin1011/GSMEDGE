import { serve } from '@hono/node-server';
import app from '../../server';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`🚀 Server starting on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
