/**
 * Open Drizzle Studio for database management
 */

import { spawn } from 'child_process';
import { resolve } from 'path';
import chalk from 'chalk';

interface StudioOptions {
  port: string;
  host: string;
}

export async function openStudio(options: StudioOptions) {
  console.log(chalk.blue('🎨 Opening Drizzle Studio...\n'));

  console.log(chalk.gray(`Host: ${options.host}:${options.port}\n`));

  try {
    const args = [
      'drizzle-kit',
      'studio',
      `--port=${options.port}`,
      `--host=${options.host}`,
    ];

    const child = spawn('npx', args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      shell: true,
    });

    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n\n👋 Closing Drizzle Studio...'));
      child.kill('SIGINT');
      process.exit(0);
    });

    child.on('error', (error) => {
      console.error(chalk.red('\n❌ Failed to start Drizzle Studio'));
      console.error(chalk.red(error.message));
      process.exit(1);
    });

    child.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.error(chalk.red(`\n❌ Drizzle Studio exited with code ${code}`));
        process.exit(code);
      }
    });
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to start Drizzle Studio'));
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    process.exit(1);
  }
}
