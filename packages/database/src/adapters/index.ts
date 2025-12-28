/**
 * YLSTACK Database Adapters
 * Multi-runtime database connection factory
 * Supports: SQLite, Turso (libSQL), Cloudflare D1, PostgreSQL (Neon)
 */

import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleLibSQL } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// Runtime detection
export type RuntimeEnvironment = 'node' | 'cloudflare' | 'deno' | 'vercel-edge';
export type DatabaseType = 'sqlite' | 'turso' | 'd1' | 'postgres' | 'neon';

export interface DatabaseConfig {
  type: DatabaseType;
  url?: string;
  authToken?: string;
  d1Binding?: D1Database;
  runtime?: RuntimeEnvironment;
}

export type DatabaseInstance = 
  | BetterSQLite3Database
  | LibSQLDatabase
  | DrizzleD1Database
  | PostgresJsDatabase;

/**
 * Detect current runtime environment
 */
export function detectRuntime(): RuntimeEnvironment {
  // Cloudflare Workers
  if (typeof (globalThis as any).caches !== 'undefined' && 'default' in (globalThis as any).caches) {
    return 'cloudflare';
  }
  
  // Deno
  if (typeof (globalThis as any).Deno !== 'undefined') {
    return 'deno';
  }
  
  // Vercel Edge (has EdgeRuntime global)
  if (typeof (globalThis as any).EdgeRuntime !== 'undefined') {
    return 'vercel-edge';
  }
  
  // Node.js (fallback)
  return 'node';
}

/**
 * Create database connection based on configuration
 */
export async function createDatabaseAdapter(config: DatabaseConfig): Promise<DatabaseInstance> {
  const runtime = config.runtime || detectRuntime();
  
  switch (config.type) {
    case 'sqlite': {
      // SQLite (Node.js only)
      if (runtime !== 'node') {
        throw new Error('SQLite adapter only works in Node.js runtime');
      }
      
      const Database = (await import('better-sqlite3')).default;
      const sqlite = new Database(config.url || ':memory:');
      return drizzleSQLite(sqlite);
    }
    
    case 'turso': {
      // Turso (libSQL) - Works in all runtimes
      if (!config.url) {
        throw new Error('Turso requires a database URL');
      }
      
      const { createClient } = await import('@libsql/client');
      const client = createClient({
        url: config.url,
        authToken: config.authToken,
      });
      
      return drizzleLibSQL(client);
    }
    
    case 'd1': {
      // Cloudflare D1 (Cloudflare Workers only)
      if (runtime !== 'cloudflare') {
        throw new Error('D1 adapter only works in Cloudflare Workers runtime');
      }
      
      if (!config.d1Binding) {
        throw new Error('D1 requires a D1Database binding');
      }
      
      return drizzleD1(config.d1Binding);
    }
    
    case 'postgres':
    case 'neon': {
      // PostgreSQL / Neon - Works in all runtimes
      if (!config.url) {
        throw new Error('PostgreSQL requires a database URL');
      }
      
      const postgres = (await import('postgres')).default;
      const client = postgres(config.url);
      
      return drizzlePostgres(client);
    }
    
    default:
      throw new Error(`Unsupported database type: ${config.type}`);
  }
}

/**
 * Parse database configuration from environment
 */
export function parseDatabaseConfig(env: Record<string, any>): DatabaseConfig {
  const databaseType = (env.DATABASE_TYPE || env.DB_TYPE || 'sqlite') as DatabaseType;
  
  // Determine database URL based on type
  let databaseUrl: string | undefined;
  let authToken: string | undefined;
  
  switch (databaseType) {
    case 'turso':
      databaseUrl = env.TURSO_DATABASE_URL || env.DATABASE_URL;
      authToken = env.TURSO_AUTH_TOKEN || env.DATABASE_AUTH_TOKEN;
      break;
    case 'postgres':
      databaseUrl = env.POSTGRES_URL || env.DATABASE_URL;
      break;
    case 'sqlite':
    default:
      databaseUrl = env.DATABASE_URL || env.DB_URL;
      break;
  }
  
  // Handle D1 binding (Cloudflare Workers)
  if (env.DB && typeof env.DB === 'object') {
    return {
      type: 'd1',
      d1Binding: env.DB,
    };
  }
  
  return {
    type: databaseType,
    url: databaseUrl,
    authToken,
  };
}

/**
 * Create database adapter from environment variables
 */
export async function createDatabaseFromEnv(env: Record<string, any>): Promise<DatabaseInstance> {
  const config = parseDatabaseConfig(env);
  return createDatabaseAdapter(config);
}
