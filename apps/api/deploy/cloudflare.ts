import app from "../src/index";

// Cloudflare Workers Adapter
// This file is the entry point for Cloudflare Workers.
// It exports the Hono app which has a .fetch method compatible with the Workers runtime.

export default {
  fetch: app.fetch,
};
