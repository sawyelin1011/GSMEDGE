// Core TypeScript Definitions
// Runtime and framework agnostic

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface RuntimeAdapter {
  name: 'cloudflare' | 'vercel-edge' | 'deno' | 'node';
  waitUntil(promise: Promise<void>): void;
  env: Record<string, string | undefined>;
  getRuntime(): string;
  isDevelopment(): boolean;
}

export interface RequestMetadata {
  tenantId: string;
  userId?: string;
  userRole?: string;
  timestamp: Date;
  correlationId?: string;
}

export interface EventPayload {
  type: string;
  tenantId: string;
  data: Record<string, any>;
  timestamp: Date;
  source: string;
}
