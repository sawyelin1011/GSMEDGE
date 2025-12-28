/**
 * YLSTACK Database Commands
 * Multi-runtime database management
 */

import { Command } from 'commander';

export function dbCommand() {
  const db = new Command('db')
    .description('Database management commands');

  // Generate migrations
  db.command('generate')
    .description('Generate database migrations from schema')
    .option('-s, --schema <path>', 'Schema file path', './shared/schema.ts')
    .option('-o, --out <path>', 'Output migrations folder', './migrations')
    .option('-d, --dialect <type>', 'Database dialect (sqlite, postgresql)', 'sqlite')
    .action(async (options) => {
      const { generateMigrations } = await import('./generate.js');
      await generateMigrations(options);
    });

  // Run migrations
  db.command('migrate')
    .description('Run pending database migrations')
    .option('-d, --dir <path>', 'Migrations directory', './server/migrations')
    .option('--dry-run', 'Show migrations without running them', false)
    .action(async (options) => {
      const { runMigrations } = await import('./migrate.js');
      await runMigrations(options);
    });

  // Push schema (no migrations)
  db.command('push')
    .description('Push schema changes directly to database (development only)')
    .option('-s, --schema <path>', 'Schema file path', './shared/schema.ts')
    .option('-y, --yes', 'Skip confirmation prompts', false)
    .option('--force', 'Force push without confirmation', false)
    .action(async (options) => {
      const { pushSchema } = await import('./push.js');
      await pushSchema(options);
    });

  // Seed database
  db.command('seed')
    .description('Seed database with initial data')
    .option('-f, --file <path>', 'Seed file path', './server/seed.ts')
    .action(async (options) => {
      const { seedDatabase } = await import('./seed.js');
      await seedDatabase(options);
    });

  // Studio (Drizzle Studio)
  db.command('studio')
    .description('Open Drizzle Studio for database management')
    .option('-p, --port <port>', 'Port number', '4983')
    .option('-h, --host <host>', 'Host address', 'localhost')
    .action(async (options) => {
      const { openStudio } = await import('./studio.js');
      await openStudio(options);
    });

  // Check database connection
  db.command('check')
    .description('Check database connection and configuration')
    .action(async () => {
      const { checkDatabase } = await import('./check.js');
      await checkDatabase();
    });

  // Initialize database
  db.command('init')
    .description('Initialize database with schema')
    .option('-t, --type <type>', 'Database type (sqlite, turso, d1, postgresql)', 'sqlite')
    .option('--url <url>', 'Database connection URL')
    .option('-y, --yes', 'Skip confirmation prompts', false)
    .option('-f, --force', 'Force overwrite existing files', false)
    .action(async (options) => {
      const { initDatabase } = await import('./init.js');
      await initDatabase(options);
    });

  return db;
}
