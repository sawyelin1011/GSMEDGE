/**
 * Run database seed scripts
 */

import { spawn } from 'child_process';
import { resolve } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';

interface SeedOptions {
  file: string;
}

export async function seedDatabase(options: SeedOptions) {
  console.log(chalk.blue('🌱 Seeding database...\n'));

  const seedPath = resolve(process.cwd(), options.file);

  // Check if seed file exists
  if (!existsSync(seedPath)) {
    console.error(chalk.red(`❌ Seed file not found: ${seedPath}`));
    console.log(chalk.gray('\nCreate a seed file with:'));
    console.log(chalk.cyan('  mkdir -p server/seeds'));
    console.log(chalk.cyan('  touch server/seeds/seed.ts'));
    process.exit(1);
  }

  console.log(chalk.gray(`Seed file: ${seedPath}`));

  try {
    // Use tsx to run TypeScript seed files
    const child = spawn('npx', ['tsx', seedPath], {
      stdio: 'inherit',
      cwd: process.cwd(),
      shell: true,
    });

    child.on('error', (error) => {
      console.error(chalk.red('\n❌ Failed to run seed script'));
      console.error(chalk.red(error.message));
      process.exit(1);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('\n✅ Database seeded successfully!'));
      } else {
        console.error(chalk.red(`\n❌ Seed script exited with code ${code}`));
        process.exit(code || 1);
      }
    });
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to run seed script'));
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    process.exit(1);
  }
}
