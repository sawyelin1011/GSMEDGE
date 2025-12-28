import app from "../apps/api/src/index";
import { handle } from "hono/cloudflare-pages"; // Example for Cloudflare, or just export default app

// For generic edge runtimes (Vercel Edge, Cloudflare Workers)
// The Hono app object itself has a .fetch method which is the standard entry point.
export default app;

// If you need a specific adapter for a platform, Hono provides them:
// import { handle } from 'hono/vercel'
// export const GET = handle(app)
// export const POST = handle(app)
