/**
 * Initialize a new database configuration
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import chalk from 'chalk';
import prompts from 'prompts';

interface InitOptions {
  type: string;
  url?: string;
  yes?: boolean;
  force?: boolean;
}

const DATABASE_TEMPLATES = {
  sqlite: {
    env: `# SQLite Database (Development)
DATABASE_TYPE=sqlite
DATABASE_URL=./server/db/local.db
`,
    config: `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.ts',
  out: './server/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || './server/db/local.db',
  },
});
`,
  },
  turso: {
    env: `# Turso Database (libSQL)
DATABASE_TYPE=turso
DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
`,
    config: `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.ts',
  out: './server/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
`,
  },
  d1: {
    env: `# Cloudflare D1 Database
DATABASE_TYPE=d1
# D1 binding is configured in wrangler.toml
`,
    config: `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.ts',
  out: './server/migrations',
  dialect: 'sqlite',
  // D1 uses wrangler for migrations
  // Run: wrangler d1 migrations apply <database-name>
});
`,
  },
  postgresql: {
    env: `# PostgreSQL Database (Neon, Supabase, etc.)
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@host:5432/database
`,
    config: `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.ts',
  out: './server/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
`,
  },
};

export async function initDatabase(options: InitOptions) {
  console.log(chalk.blue('🗄️  Initializing database configuration...\n'));

  const envPath = resolve(process.cwd(), '.env');
  const configPath = resolve(process.cwd(), 'drizzle.config.ts');

  // Check if files already exist
  if (existsSync(envPath) || existsSync(configPath)) {
    console.log(chalk.yellow('⚠️  Configuration files already exist:'));
    if (existsSync(envPath)) console.log(chalk.gray(`  - ${envPath}`));
    if (existsSync(configPath)) console.log(chalk.gray(`  - ${configPath}`));
    
    // Skip prompt if --yes or --force flag is provided
    if (!options.yes && !options.force) {
      console.log(chalk.gray('\nBackup your existing files before proceeding.\n'));

      const response = await prompts({
        type: 'confirm' as const,
        name: 'overwrite',
        message: 'Overwrite existing files?',
        initial: false,
      });

      if (!response.overwrite) {
        console.log(chalk.gray('Cancelled'));
        return;
      }
    } else {
      console.log(chalk.gray('Overwriting existing files (--yes or --force flag provided)\n'));
    }
  }

  // Use provided type or prompt
  let dbType = options.type;
  
  if (!['sqlite', 'turso', 'd1', 'postgresql'].includes(dbType)) {
    // Only prompt if not in non-interactive mode
    if (options.yes || options.force) {
      console.log(chalk.yellow(`⚠️  Invalid database type "${dbType}", defaulting to sqlite`));
      dbType = 'sqlite';
    } else {
      const response = await prompts({
        type: 'select' as const,
        name: 'dbType',
        message: 'Select database type:',
        choices: [
          { title: 'SQLite (Development)', value: 'sqlite', description: 'Local file-based database' },
          { title: 'Turso (libSQL)', value: 'turso', description: 'Edge-compatible SQLite' },
          { title: 'Cloudflare D1', value: 'd1', description: 'Cloudflare Workers database' },
          { title: 'PostgreSQL', value: 'postgresql', description: 'Neon, Supabase, etc.' },
        ],
      });

      if (!response.dbType) {
        console.log(chalk.gray('Cancelled'));
        return;
      }
      
      dbType = response.dbType;
    }
  }

  const template = DATABASE_TEMPLATES[dbType as keyof typeof DATABASE_TEMPLATES];

  try {
    // Create .env file
    writeFileSync(envPath, template.env);
    console.log(chalk.green(`✅ Created ${envPath}`));

    // Create drizzle.config.ts
    writeFileSync(configPath, template.config);
    console.log(chalk.green(`✅ Created ${configPath}`));

    // Create directories if needed
    const dbDir = resolve(process.cwd(), 'server/db');
    const migrationsDir = resolve(process.cwd(), 'server/migrations');

    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
      console.log(chalk.green(`✅ Created ${dbDir}`));
    }

    if (!existsSync(migrationsDir)) {
      mkdirSync(migrationsDir, { recursive: true });
      console.log(chalk.green(`✅ Created ${migrationsDir}`));
    }

    console.log(chalk.blue('\n📝 Next steps:'));
    console.log(chalk.gray('  1. Update .env with your database credentials'));
    console.log(chalk.gray('  2. Define your schema in shared/schema.ts'));
    console.log(chalk.gray('  3. Generate migrations: ylstack db generate'));
    console.log(chalk.gray('  4. Run migrations: ylstack db migrate\n'));

    if (dbType === 'd1') {
      console.log(chalk.yellow('⚠️  Cloudflare D1 requires additional setup:'));
      console.log(chalk.gray('  1. Create D1 database: wrangler d1 create <database-name>'));
      console.log(chalk.gray('  2. Add binding to wrangler.toml'));
      console.log(chalk.gray('  3. Apply migrations: wrangler d1 migrations apply <database-name>\n'));
    }

    if (dbType === 'turso') {
      console.log(chalk.yellow('⚠️  Turso requires authentication:'));
      console.log(chalk.gray('  1. Install Turso CLI: https://docs.turso.tech/cli/installation'));
      console.log(chalk.gray('  2. Create database: turso db create <database-name>'));
      console.log(chalk.gray('  3. Get connection URL: turso db show <database-name>'));
      console.log(chalk.gray('  4. Create auth token: turso db tokens create <database-name>\n'));
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to initialize database'));
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    process.exit(1);
  }
}
