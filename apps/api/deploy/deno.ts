import app from "../src/index";

// Deno Deploy Adapter
// This file is the entry point for Deno Deploy.

// @ts-ignore - Deno global is available in Deno runtime
Deno.serve(app.fetch);
