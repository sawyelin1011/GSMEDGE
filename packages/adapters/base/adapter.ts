// Base Runtime Adapter
// Abstracts runtime differences (Cloudflare, Vercel, Deno, Node.js)
// All adapters must implement this interface

export interface RuntimeEnv {
  DATABASE_URL?: string;
  JWT_SECRET?: string;
  ENVIRONMENT?: 'development' | 'production';
  [key: string]: string | undefined;
}

export interface RequestContext {
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: unknown;
  query?: Record<string, string>;
}

export interface ResponseContext {
  status: number;
  headers: Record<string, string>;
  body: unknown;
}

export abstract class BaseRuntimeAdapter {
  protected name: string;
  protected env: RuntimeEnv;

  constructor(name: string, env: RuntimeEnv) {
    this.name = name;
    this.env = env;
  }

  abstract waitUntil(promise: Promise<void>): void;
  abstract getEnv(key: string): string | undefined;

  getRuntime(): string {
    return this.name;
  }

  isDevelopment(): boolean {
    return this.env.ENVIRONMENT === 'development';
  }

  async initialize(): Promise<void> {
    console.log(`[${this.name} Adapter] Initialized`);
  }
}

// Example adapters (implemented per runtime)

export class NodeAdapter extends BaseRuntimeAdapter {
  constructor(env: RuntimeEnv) {
    super('node', env);
  }

  waitUntil(promise: Promise<void>): void {
    // Node.js will wait for all promises to settle before exit
    promise.catch(console.error);
  }

  getEnv(key: string): string | undefined {
    return process.env[key];
  }
}

export class CloudflareAdapter extends BaseRuntimeAdapter {
  private waitUntilQueue: Promise<void>[] = [];

  constructor(env: RuntimeEnv) {
    super('cloudflare', env);
  }

  waitUntil(promise: Promise<void>): void {
    // Store for Cloudflare waitUntil
    this.waitUntilQueue.push(promise);
  }

  getEnv(key: string): string | undefined {
    return this.env[key];
  }
}

export class VercelEdgeAdapter extends BaseRuntimeAdapter {
  constructor(env: RuntimeEnv) {
    super('vercel-edge', env);
  }

  waitUntil(promise: Promise<void>): void {
    // Vercel Edge will handle background execution
    promise.catch(console.error);
  }

  getEnv(key: string): string | undefined {
    return this.env[key];
  }
}

export class DenoAdapter extends BaseRuntimeAdapter {
  constructor(env: RuntimeEnv) {
    super('deno', env);
  }

  waitUntil(promise: Promise<void>): void {
    // Deno will continue running until all promises settle
    promise.catch(console.error);
  }

  getEnv(key: string): string | undefined {
    return this.env[key];
  }
}
