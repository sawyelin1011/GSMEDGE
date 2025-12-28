export interface Env {
  DATABASE_URL: string;
  // JWT_SECRET: string; // For Phase 2
  // WORKER_ENV: 'development' | 'production';
}

export interface AdapterContext {
  env: Env;
  waitUntil: (promise: Promise<void>) => void;
}
