/**
 * Run database migrations
 */

import { resolve } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { createDatabaseFromEnv, runMigrations as runMigrationsUtil } from '@ylstack/database';
import { parseDatabaseConfig } from '@ylstack/database/adapters';
import dotenv from 'dotenv';

interface MigrateOptions {
  dir: string;
  dryRun: boolean;
}

export async function runMigrations(options: MigrateOptions) {
  console.log(chalk.blue('🔄 Running database migrations...\n'));

  // Load environment variables
  dotenv.config();

  const migrationsDir = resolve(process.cwd(), options.dir);

  // Validate migrations directory exists
  if (!existsSync(migrationsDir)) {
    console.error(chalk.red(`❌ Migrations directory not found: ${migrationsDir}`));
    console.log(chalk.gray('\nGenerate migrations first with: ylstack db generate'));
    process.exit(1);
  }

  // Parse database configuration
  const dbConfig = parseDatabaseConfig(process.env);
  
  console.log(chalk.gray(`Database type: ${dbConfig.type}`));
  console.log(chalk.gray(`Migrations dir: ${migrationsDir}`));
  
  if (options.dryRun) {
    console.log(chalk.yellow('\n⚠️  Dry run mode - no changes will be made\n'));
  }

  try {
    // Create database connection
    const db = await createDatabaseFromEnv(process.env);

    if (options.dryRun) {
      console.log(chalk.yellow('Would run migrations from:'), migrationsDir);
      console.log(chalk.green('\n✅ Dry run completed'));
      return;
    }

    // Run migrations
    await runMigrationsUtil(db, {
      migrationsFolder: migrationsDir,
      migrationsTable: 'migrations',
    }, dbConfig.type);

    console.log(chalk.green('\n✅ Migrations completed successfully!'));
  } catch (error) {
    console.error(chalk.red('\n❌ Migration failed'));
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    process.exit(1);
  }
}
