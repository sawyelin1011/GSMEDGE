/**
 * Setup Command
 * 
 * Initializes a new or existing Edge Starter Kit project.
 * Handles environment setup, dependency installation, and database initialization.
 */

import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

interface SetupOptions {
  skipInstall?: boolean;
  skipDb?: boolean;
  force?: boolean;
}

export const setupCommand = () => {
  return new Command('setup')
    .description('Initialize project environment and dependencies')
    .option('--skip-install', 'Skip npm install')
    .option('--skip-db', 'Skip database setup')
    .option('-f, --force', 'Force setup even if already configured')
    .action(async (options: SetupOptions) => {
      console.log(chalk.bold.cyan('\n⚙️  Edge Starter Kit - Project Setup\n'));

      try {
        const cwd = process.cwd();

        // Check if package.json exists
        const pkgJsonPath = path.join(cwd, 'package.json');
        if (!(await fs.pathExists(pkgJsonPath))) {
          console.log(chalk.red('❌ No package.json found. Are you in an Edge Starter Kit project?'));
          process.exit(1);
        }

        // Step 1: Install dependencies
        if (!options.skipInstall) {
          const spinner = ora('Installing dependencies...').start();
          try {
            await execa('npm', ['install'], { cwd, stdio: 'pipe' });
            spinner.succeed('Dependencies installed');
          } catch (error) {
            spinner.fail('Failed to install dependencies');
            throw error;
          }
        }

        // Step 2: Setup environment variables
        await setupEnvironment(cwd, options.force || false);

        // Step 3: Setup database
        if (!options.skipDb) {
          await setupDatabase(cwd, options.force || false);
        }

        // Step 4: Verify adapter configuration
        await verifyAdapter(cwd);

        // Success message
        console.log(chalk.bold.green('\n✅ Setup complete!\n'));
        console.log(chalk.cyan('Next steps:\n'));
        console.log(chalk.gray('  npm run dev          # Start development server'));
        console.log(chalk.gray('  npm run build        # Build for production'));
        console.log(chalk.gray('  edge migrate run     # Run database migrations\n'));

      } catch (error) {
        console.error(chalk.red('\n❌ Setup error:'), error);
        process.exit(1);
      }
    });
};

/**
 * Setup environment variables
 */
async function setupEnvironment(cwd: string, force: boolean): Promise<void> {
  const envPath = path.join(cwd, '.env');
  const envExamplePath = path.join(cwd, '.env.example');

  // Check if .env already exists
  if ((await fs.pathExists(envPath)) && !force) {
    console.log(chalk.yellow('⚠️  .env file already exists (use --force to overwrite)'));
    return;
  }

  const spinner = ora('Setting up environment variables...').start();

  try {
    // Copy from .env.example if it exists
    if (await fs.pathExists(envExamplePath)) {
      await fs.copy(envExamplePath, envPath);
      spinner.succeed('Environment file created from .env.example');
    } else {
      // Create a basic .env file
      const defaultEnv = `# Edge Starter Kit Environment Variables

# Database
DATABASE_URL=file:./local.db

# API
API_URL=http://localhost:5173/api

# Environment
NODE_ENV=development
`;
      await fs.writeFile(envPath, defaultEnv, 'utf-8');
      spinner.succeed('Environment file created with defaults');
    }

    console.log(chalk.dim(`   📄 Created: ${envPath}`));

    // Prompt for custom values
    const customize = await prompts({
      type: 'confirm' as const,
      name: 'value',
      message: 'Would you like to customize environment variables now?',
      initial: false
    });

    if (customize.value) {
      await customizeEnvironment(envPath);
    }

  } catch (error) {
    spinner.fail('Failed to setup environment');
    throw error;
  }
}

/**
 * Interactively customize environment variables
 */
async function customizeEnvironment(envPath: string): Promise<void> {
  console.log(chalk.cyan('\n📝 Customize environment variables:\n'));

  const questions = [
    {
      type: 'text' as const,
      name: 'DATABASE_URL',
      message: 'Database URL:',
      initial: 'file:./local.db'
    },
    {
      type: 'text' as const,
      name: 'API_URL',
      message: 'API URL:',
      initial: 'http://localhost:5173/api'
    }
  ];

  const answers = await prompts(questions);

  // Update .env file
  let envContent = await fs.readFile(envPath, 'utf-8');
  
  for (const [key, value] of Object.entries(answers)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  await fs.writeFile(envPath, envContent, 'utf-8');
  console.log(chalk.green('✓ Environment variables updated\n'));
}

/**
 * Setup database
 */
async function setupDatabase(cwd: string, force: boolean): Promise<void> {
  const dbPath = path.join(cwd, 'local.db');

  // Check if database already exists
  if ((await fs.pathExists(dbPath)) && !force) {
    console.log(chalk.yellow('⚠️  Database already exists (use --force to reset)'));
    
    const runMigrations = await prompts({
      type: 'confirm' as const,
      name: 'value',
      message: 'Run pending migrations?',
      initial: true
    });

    if (runMigrations.value) {
      const spinner = ora('Running migrations...').start();
      try {
        await execa('npm', ['run', 'db:migrate'], { cwd, stdio: 'pipe' });
        spinner.succeed('Migrations applied');
      } catch (error) {
        spinner.warn('Migration script not found or failed');
      }
    }
    return;
  }

  const spinner = ora('Setting up database...').start();

  try {
    // Generate migrations if needed
    try {
      await execa('npm', ['run', 'db:generate'], { cwd, stdio: 'pipe' });
      spinner.text = 'Migrations generated...';
    } catch (error) {
      // Migration generation might fail if no changes, that's ok
    }

    // Run migrations
    await execa('npm', ['run', 'db:migrate'], { cwd, stdio: 'pipe' });
    spinner.succeed('Database initialized');

    console.log(chalk.dim(`   📄 Created: ${dbPath}`));

  } catch (error) {
    spinner.fail('Failed to setup database');
    console.log(chalk.yellow('\n⚠️  Database setup failed. You may need to run migrations manually:'));
    console.log(chalk.dim('   npm run db:generate'));
    console.log(chalk.dim('   npm run db:migrate\n'));
  }
}

/**
 * Verify adapter configuration
 */
async function verifyAdapter(cwd: string): Promise<void> {
  const adapterPath = path.join(cwd, '.adapter', 'current');

  if (!(await fs.pathExists(adapterPath))) {
    console.log(chalk.yellow('\n⚠️  No adapter configured'));
    
    const configure = await prompts({
      type: 'confirm' as const,
      name: 'value',
      message: 'Would you like to configure an adapter now?',
      initial: true
    });

    if (configure.value) {
      const adapter = await prompts({
        type: 'select' as const,
        name: 'value',
        message: 'Select runtime adapter:',
        choices: [
          { title: 'Cloudflare Workers', value: 'cloudflare' },
          { title: 'Deno Deploy', value: 'deno' },
          { title: 'Vercel Edge Functions', value: 'vercel' },
          { title: 'Node.js', value: 'node' }
        ]
      });

      if (adapter.value) {
        await fs.ensureDir(path.join(cwd, '.adapter'));
        await fs.writeFile(adapterPath, adapter.value, 'utf-8');
        console.log(chalk.green(`✓ Adapter set to: ${adapter.value}\n`));
      }
    }
  } else {
    const currentAdapter = (await fs.readFile(adapterPath, 'utf-8')).trim();
    console.log(chalk.cyan(`\n✓ Current adapter: ${currentAdapter}`));
  }
}
