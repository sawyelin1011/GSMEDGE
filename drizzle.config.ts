import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const databaseType = process.env.DATABASE_TYPE || 'sqlite';

// Determine database URL based on type
let dbUrl: string;
if (databaseType === 'turso') {
  dbUrl = process.env.TURSO_DATABASE_URL || '';
} else {
  // For SQLite, use hardcoded path to avoid system env var conflicts
  dbUrl = './server/db/local.db';
}

export default defineConfig({
  schema: './shared/schema.ts',
  out: './server/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: dbUrl,
    ...(databaseType === 'turso' && {
      authToken: process.env.TURSO_AUTH_TOKEN,
    }),
  },
});
