import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

// NOTE: This database setup using 'better-sqlite3' is for Node.js environments (Local Dev).
// For Edge deployment (Cloudflare Workers), you would use:
// import { drizzle } from 'drizzle-orm/d1';
// export const db = drizzle(env.DB, { schema });

if (!process.env.DATABASE_URL) {
  console.log("No DATABASE_URL set, defaulting to local sqlite.db");
}

const sqlite = new Database(process.env.DATABASE_URL || "sqlite.db");
export const db = drizzle(sqlite, { schema });
