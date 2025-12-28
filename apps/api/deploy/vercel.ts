import { handle } from 'hono/vercel';
import app from '../src/index';

// Vercel Edge Adapter
// This file is the entry point for Vercel Edge Functions.

export const config = {
  runtime: 'edge',
};

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
