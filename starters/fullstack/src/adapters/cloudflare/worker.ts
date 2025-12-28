import app from '../../server';

// Cloudflare Workers entry point
export default {
  async fetch(request: Request, env: any, ctx: any) {
    // Inject Cloudflare bindings into Hono context
    return app.fetch(request, { ...env, ctx });
  },
};
