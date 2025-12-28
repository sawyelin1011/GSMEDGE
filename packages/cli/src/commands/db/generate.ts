/**
 * Generate database migrations
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';

interface GenerateOptions {
  schema: string;
  out: string;
  dialect: 'sqlite' | 'postgresql';
}

export async function generateMigrations(options: GenerateOptions) {
  console.log(chalk.blue('📝 Generating database migrations...\n'));

  // Check if drizzle.config.ts exists
  const configPath = resolve(process.cwd(), 'drizzle.config.ts');
  const useConfig = existsSync(configPath);

  if (useConfig) {
    console.log(chalk.gray(`Using config: ${configPath}\n`));
    
    try {
      // Run drizzle-kit generate with config file
      const command = `npx drizzle-kit generate`;
      
      console.log(chalk.gray(`Running: ${command}\n`));
      
      execSync(command, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });

      console.log(chalk.green('\n✅ Migrations generated successfully!'));
      console.log(chalk.gray(`\nNext steps:`));
      console.log(chalk.gray(`  1. Review migrations in server/migrations`));
      console.log(chalk.gray(`  2. Run migrations with: ylstack db migrate`));
    } catch (error) {
      console.error(chalk.red('\n❌ Failed to generate migrations'));
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  } else {
    // Fallback to manual paths if no config file
    const schemaPath = resolve(process.cwd(), options.schema);
    const outPath = resolve(process.cwd(), options.out);

    // Validate schema file exists
    if (!existsSync(schemaPath)) {
      console.error(chalk.red(`❌ Schema file not found: ${schemaPath}`));
      process.exit(1);
    }

    console.log(chalk.gray(`Schema: ${schemaPath}`));
    console.log(chalk.gray(`Output: ${outPath}`));
    console.log(chalk.gray(`Dialect: ${options.dialect}\n`));

    try {
      // Run drizzle-kit generate
      const command = `npx drizzle-kit generate --schema=${schemaPath} --out=${outPath} --dialect=${options.dialect}`;
      
      console.log(chalk.gray(`Running: ${command}\n`));
      
      execSync(command, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });

      console.log(chalk.green('\n✅ Migrations generated successfully!'));
      console.log(chalk.gray(`\nNext steps:`));
      console.log(chalk.gray(`  1. Review migrations in ${outPath}`));
      console.log(chalk.gray(`  2. Run migrations with: ylstack db migrate`));
    } catch (error) {
      console.error(chalk.red('\n❌ Failed to generate migrations'));
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  }
}
