/**
 * Push schema changes directly to database
 */

import { execSync } from 'child_process';
import { resolve } from 'path';
import chalk from 'chalk';
import prompts from 'prompts';

interface PushOptions {
  schema: string;
  force: boolean;
  yes?: boolean;
}

export async function pushSchema(options: PushOptions) {
  console.log(chalk.blue('📤 Pushing schema changes to database...\n'));

  const schemaPath = resolve(process.cwd(), options.schema);

  console.log(chalk.yellow('⚠️  WARNING: This will directly modify your database schema'));
  console.log(chalk.yellow('⚠️  This is recommended for development only\n'));

  if (!options.force && !options.yes) {
    const response = await prompts({
      type: 'confirm' as const,
      name: 'confirm',
      message: 'Are you sure you want to push schema changes?',
      initial: false,
    });

    if (!response.confirm) {
      console.log(chalk.gray('Cancelled'));
      return;
    }
  } else if (options.yes || options.force) {
    console.log(chalk.gray('Skipping confirmation (--yes or --force flag provided)\n'));
  }

  try {
    // Use drizzle.config.ts if it exists, otherwise use schema path
    const configPath = resolve(process.cwd(), 'drizzle.config.ts');
    const { existsSync } = await import('fs');
    
    let command: string;
    if (existsSync(configPath)) {
      console.log(chalk.gray(`Using config: ${configPath}\n`));
      command = `npx drizzle-kit push`;
    } else {
      command = `npx drizzle-kit push --schema=${schemaPath}`;
    }
    
    console.log(chalk.gray(`Running: ${command}\n`));
    
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    console.log(chalk.green('\n✅ Schema pushed successfully!'));
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to push schema'));
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    process.exit(1);
  }
}
