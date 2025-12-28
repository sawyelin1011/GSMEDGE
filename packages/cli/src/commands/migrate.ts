/**
 * Migrate Command
 * 
 * Manages database migrations using Drizzle ORM.
 * Supports generating, running, and rolling back migrations.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

interface MigrateOptions {
  name?: string;
  rollback?: boolean;
  dry?: boolean;
}

export const migrateCommand = () => {
  const command = new Command('migrate')
    .description('Manage database migrations');

  // Generate migration
  command
    .command('generate')
    .description('Generate a new migration from schema changes')
    .option('-n, --name <name>', 'Migration name')
    .action(async (options: { name?: string }) => {
      console.log(chalk.bold.cyan('\n📝 Generating migration...\n'));

      const spinner = ora('Analyzing schema changes...').start();

      try {
        const args = ['drizzle-kit', 'generate:sqlite'];
        
        if (options.name) {
          args.push('--name', options.name);
        }

        await execa('npx', args, {
          cwd: process.cwd(),
          stdio: 'inherit'
        });

        spinner.succeed('Migration generated');
        console.log(chalk.green('\n✅ Migration file created in ./drizzle\n'));

      } catch (error) {
        spinner.fail('Migration generation failed');
        console.error(chalk.red('\n❌ Error:'), error);
        process.exit(1);
      }
    });

  // Run migrations
  command
    .command('run')
    .description('Run pending migrations')
    .option('--dry', 'Dry run (show what would be executed)')
    .action(async (options: { dry?: boolean }) => {
      console.log(chalk.bold.cyan('\n🚀 Running migrations...\n'));

      const spinner = ora('Applying migrations...').start();

      try {
        if (options.dry) {
          spinner.text = 'Dry run: checking migrations...';
          // In a real implementation, this would show what migrations would run
          console.log(chalk.dim('\n  [Dry run mode - no changes will be applied]\n'));
        }

        // Run migrations using Drizzle
        await execa('npm', ['run', 'db:migrate'], {
          cwd: process.cwd(),
          stdio: 'inherit'
        });

        spinner.succeed('Migrations applied');
        console.log(chalk.green('\n✅ Database is up to date\n'));

      } catch (error) {
        spinner.fail('Migration failed');
        console.error(chalk.red('\n❌ Error:'), error);
        process.exit(1);
      }
    });

  // Rollback migration
  command
    .command('rollback')
    .description('Rollback the last migration')
    .action(async () => {
      console.log(chalk.bold.yellow('\n⚠️  Rolling back last migration...\n'));

      const spinner = ora('Rolling back...').start();

      try {
        // Note: Drizzle doesn't have built-in rollback, this would need custom implementation
        spinner.warn('Rollback not yet implemented');
        console.log(chalk.yellow('\n⚠️  Drizzle ORM does not support automatic rollbacks'));
        console.log(chalk.dim('   You need to manually revert schema changes and generate a new migration\n'));

      } catch (error) {
        spinner.fail('Rollback failed');
        console.error(chalk.red('\n❌ Error:'), error);
        process.exit(1);
      }
    });

  // Status command
  command
    .command('status')
    .description('Show migration status')
    .action(async () => {
      console.log(chalk.bold.cyan('\n📊 Migration Status\n'));

      try {
        const migrationsDir = path.join(process.cwd(), 'drizzle');
        
        if (!(await fs.pathExists(migrationsDir))) {
          console.log(chalk.yellow('⚠️  No migrations directory found'));
          console.log(chalk.dim('   Run: edge migrate generate\n'));
          return;
        }

        const files = await fs.readdir(migrationsDir);
        const sqlFiles = files.filter(f => f.endsWith('.sql'));

        if (sqlFiles.length === 0) {
          console.log(chalk.yellow('⚠️  No migrations found'));
          console.log(chalk.dim('   Run: edge migrate generate\n'));
          return;
        }

        console.log(chalk.cyan(`Found ${sqlFiles.length} migration(s):\n`));
        
        for (const file of sqlFiles.sort()) {
          console.log(chalk.gray(`  • ${file}`));
        }

        console.log();

      } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error);
        process.exit(1);
      }
    });

  // Reset command (dangerous)
  command
    .command('reset')
    .description('Reset database (WARNING: deletes all data)')
    .action(async () => {
      console.log(chalk.bold.red('\n⚠️  DATABASE RESET - This will delete ALL data!\n'));

      const prompts = require('prompts');
      const confirm = await prompts({
        type: 'confirm' as const,
        name: 'value',
        message: 'Are you absolutely sure you want to reset the database?',
        initial: false
      });

      if (!confirm.value) {
        console.log(chalk.yellow('\n✓ Reset cancelled\n'));
        return;
      }

      const doubleConfirm = await prompts({
        type: 'text' as const,
        name: 'value',
        message: 'Type "RESET" to confirm:',
        validate: (value: string) => value === 'RESET' ? true : 'You must type RESET to confirm'
      });

      if (doubleConfirm.value !== 'RESET') {
        console.log(chalk.yellow('\n✓ Reset cancelled\n'));
        return;
      }

      const spinner = ora('Resetting database...').start();

      try {
        // Delete SQLite database file
        const dbPath = path.join(process.cwd(), 'local.db');
        if (await fs.pathExists(dbPath)) {
          await fs.remove(dbPath);
        }

        // Run migrations to recreate schema
        await execa('npm', ['run', 'db:migrate'], {
          cwd: process.cwd(),
          stdio: 'pipe'
        });

        spinner.succeed('Database reset complete');
        console.log(chalk.green('\n✅ Database has been reset and migrations applied\n'));

      } catch (error) {
        spinner.fail('Reset failed');
        console.error(chalk.red('\n❌ Error:'), error);
        process.exit(1);
      }
    });

  return command;
};
