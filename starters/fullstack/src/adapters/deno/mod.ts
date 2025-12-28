import app from '../../server/index.ts';

// Deno Deploy entry point
(globalThis as any).Deno.serve((request: Request) => {
  return app.fetch(request);
});
