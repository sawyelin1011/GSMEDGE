/**
 * Build Command
 * 
 * Builds the application for a specific adapter/runtime.
 * Handles adapter-specific build processes and configurations.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

interface BuildOptions {
  watch?: boolean;
  production?: boolean;
}

const ADAPTERS = ['cloudflare', 'deno', 'vercel', 'node'] as const;
type Adapter = typeof ADAPTERS[number];

export const buildCommand = () => {
  return new Command('build')
    .description('Build the application for a specific adapter')
    .argument('[adapter]', 'Target adapter: cloudflare|deno|vercel|node')
    .option('-w, --watch', 'Watch mode for development')
    .option('-p, --production', 'Production build with optimizations')
    .action(async (adapterArg: string | undefined, options: BuildOptions) => {
      console.log(chalk.bold.cyan('\n🔨 Edge Starter Kit - Build\n'));

      try {
        // Detect current adapter
        const adapter = await detectAdapter(adapterArg);
        
        if (!adapter) {
          console.log(chalk.red('❌ No adapter specified and could not detect current adapter'));
          console.log(chalk.yellow(`\nValid adapters: ${ADAPTERS.join(', ')}`));
          console.log(chalk.dim('\nRun: edge build <adapter>'));
          process.exit(1);
        }

        console.log(chalk.cyan(`📦 Building for: ${adapter}\n`));

        const spinner = ora('Building...').start();

        try {
          await buildForAdapter(adapter, options);
          spinner.succeed(`Build completed for ${adapter}`);

          // Show output location
          const outputPath = getOutputPath(adapter);
          if (outputPath) {
            console.log(chalk.gray(`\n📁 Output: ${outputPath}`));
          }

          console.log(chalk.green('\n✅ Build successful!\n'));

        } catch (error) {
          spinner.fail('Build failed');
          throw error;
        }

      } catch (error) {
        console.error(chalk.red('\n❌ Build error:'), error);
        process.exit(1);
      }
    });
};

/**
 * Detect the current adapter from project configuration
 */
async function detectAdapter(adapterArg?: string): Promise<Adapter | null> {
  // If adapter provided as argument, use it
  if (adapterArg) {
    if (ADAPTERS.includes(adapterArg as Adapter)) {
      return adapterArg as Adapter;
    }
    console.log(chalk.yellow(`⚠️  Invalid adapter: ${adapterArg}`));
    return null;
  }

  // Try to read from .adapter/current file
  const adapterFilePath = path.join(process.cwd(), '.adapter', 'current');
  if (await fs.pathExists(adapterFilePath)) {
    const adapter = (await fs.readFile(adapterFilePath, 'utf-8')).trim();
    if (ADAPTERS.includes(adapter as Adapter)) {
      return adapter as Adapter;
    }
  }

  // Try to detect from package.json scripts
  const pkgJsonPath = path.join(process.cwd(), 'package.json');
  if (await fs.pathExists(pkgJsonPath)) {
    const pkgJson = await fs.readJson(pkgJsonPath);
    
    // Check for adapter-specific dependencies or scripts
    if (pkgJson.dependencies?.['wrangler'] || pkgJson.scripts?.['build:cloudflare']) {
      return 'cloudflare';
    }
    if (pkgJson.scripts?.['build:deno']) {
      return 'deno';
    }
    if (pkgJson.dependencies?.['vercel'] || pkgJson.scripts?.['build:vercel']) {
      return 'vercel';
    }
    if (pkgJson.scripts?.['build:node']) {
      return 'node';
    }
  }

  return null;
}

/**
 * Build for a specific adapter
 */
async function buildForAdapter(adapter: Adapter, options: BuildOptions): Promise<void> {
  const cwd = process.cwd();

  switch (adapter) {
    case 'cloudflare':
      await buildCloudflare(cwd, options);
      break;
    case 'deno':
      await buildDeno(cwd, options);
      break;
    case 'vercel':
      await buildVercel(cwd, options);
      break;
    case 'node':
      await buildNode(cwd, options);
      break;
    default:
      throw new Error(`Unknown adapter: ${adapter}`);
  }
}

/**
 * Build for Cloudflare Workers
 */
async function buildCloudflare(cwd: string, options: BuildOptions): Promise<void> {
  const args = ['run', 'build:cloudflare'];
  
  if (options.watch) {
    args.push('--', '--watch');
  }

  await execa('npm', args, {
    cwd,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: options.production ? 'production' : 'development'
    }
  });
}

/**
 * Build for Deno Deploy
 */
async function buildDeno(cwd: string, options: BuildOptions): Promise<void> {
  // Deno doesn't require a build step, but we can run type checking
  console.log(chalk.dim('  Deno Deploy uses direct deployment (no build step required)'));
  console.log(chalk.dim('  Running type check...\n'));

  try {
    await execa('deno', ['check', 'src/adapters/deno/server.ts'], {
      cwd,
      stdio: 'inherit'
    });
  } catch (error) {
    // If deno is not installed, skip type check
    console.log(chalk.yellow('  ⚠️  Deno not found, skipping type check'));
  }
}

/**
 * Build for Vercel Edge Functions
 */
async function buildVercel(cwd: string, options: BuildOptions): Promise<void> {
  const args = ['run', 'build:vercel'];

  await execa('npm', args, {
    cwd,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: options.production ? 'production' : 'development'
    }
  });
}

/**
 * Build for Node.js
 */
async function buildNode(cwd: string, options: BuildOptions): Promise<void> {
  const args = ['run', 'build:node'];
  
  if (options.watch) {
    args.push('--', '--watch');
  }

  await execa('npm', args, {
    cwd,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: options.production ? 'production' : 'development'
    }
  });
}

/**
 * Get the output path for built files
 */
function getOutputPath(adapter: Adapter): string | null {
  switch (adapter) {
    case 'cloudflare':
      return 'dist/cloudflare';
    case 'deno':
      return 'src/adapters/deno';
    case 'vercel':
      return '.vercel/output';
    case 'node':
      return 'dist/node';
    default:
      return null;
  }
}
