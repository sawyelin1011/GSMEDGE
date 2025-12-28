/**
 * Deploy Command
 * 
 * Deploys the application to a specific edge platform.
 * Handles platform-specific deployment processes and configurations.
 */

import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

interface DeployOptions {
  production?: boolean;
  preview?: boolean;
  skipBuild?: boolean;
}

const ADAPTERS = ['cloudflare', 'deno', 'vercel', 'node'] as const;
type Adapter = typeof ADAPTERS[number];

export const deployCommand = () => {
  return new Command('deploy')
    .description('Deploy the application to an edge platform')
    .argument('[adapter]', 'Target adapter: cloudflare|deno|vercel|node')
    .option('-p, --production', 'Deploy to production')
    .option('--preview', 'Deploy as preview/staging')
    .option('--skip-build', 'Skip build step before deployment')
    .action(async (adapterArg: string | undefined, options: DeployOptions) => {
      console.log(chalk.bold.cyan('\n🚀 Edge Starter Kit - Deploy\n'));

      try {
        // Detect current adapter
        const adapter = await detectAdapter(adapterArg);
        
        if (!adapter) {
          console.log(chalk.red('❌ No adapter specified and could not detect current adapter'));
          console.log(chalk.yellow(`\nValid adapters: ${ADAPTERS.join(', ')}`));
          console.log(chalk.dim('\nRun: edge deploy <adapter>'));
          process.exit(1);
        }

        // Confirm production deployment
        if (options.production) {
          const confirm = await prompts({
            type: 'confirm' as const,
            name: 'value',
            message: `Deploy to ${adapter} PRODUCTION?`,
            initial: false
          });

          if (!confirm.value) {
            console.log(chalk.yellow('\n⚠️  Deployment cancelled'));
            process.exit(0);
          }
        }

        console.log(chalk.cyan(`📦 Deploying to: ${adapter}`));
        console.log(chalk.dim(`   Environment: ${options.production ? 'production' : 'preview/staging'}\n`));

        // Build before deploy (unless skipped)
        if (!options.skipBuild) {
          const buildSpinner = ora('Building application...').start();
          try {
            await execa('npm', ['run', `build:${adapter}`], {
              cwd: process.cwd(),
              stdio: 'pipe'
            });
            buildSpinner.succeed('Build completed');
          } catch (error) {
            buildSpinner.fail('Build failed');
            throw error;
          }
        }

        // Deploy to platform
        const deploySpinner = ora('Deploying...').start();

        try {
          const deploymentUrl = await deployToAdapter(adapter, options);
          deploySpinner.succeed('Deployment completed');

          // Show deployment info
          console.log(chalk.green('\n✅ Deployment successful!\n'));
          if (deploymentUrl) {
            console.log(chalk.cyan(`🌐 URL: ${deploymentUrl}\n`));
          }

          // Show next steps
          console.log(chalk.bold('Next steps:\n'));
          console.log(chalk.gray(`  • Test your deployment at the URL above`));
          console.log(chalk.gray(`  • Monitor logs: edge logs ${adapter}`));
          console.log(chalk.gray(`  • Rollback if needed: edge rollback ${adapter}\n`));

        } catch (error) {
          deploySpinner.fail('Deployment failed');
          throw error;
        }

      } catch (error) {
        console.error(chalk.red('\n❌ Deployment error:'), error);
        process.exit(1);
      }
    });
};

/**
 * Detect the current adapter from project configuration
 */
async function detectAdapter(adapterArg?: string): Promise<Adapter | null> {
  if (adapterArg) {
    if (ADAPTERS.includes(adapterArg as Adapter)) {
      return adapterArg as Adapter;
    }
    console.log(chalk.yellow(`⚠️  Invalid adapter: ${adapterArg}`));
    return null;
  }

  const adapterFilePath = path.join(process.cwd(), '.adapter', 'current');
  if (await fs.pathExists(adapterFilePath)) {
    const adapter = (await fs.readFile(adapterFilePath, 'utf-8')).trim();
    if (ADAPTERS.includes(adapter as Adapter)) {
      return adapter as Adapter;
    }
  }

  return null;
}

/**
 * Deploy to a specific adapter platform
 */
async function deployToAdapter(adapter: Adapter, options: DeployOptions): Promise<string | null> {
  const cwd = process.cwd();

  switch (adapter) {
    case 'cloudflare':
      return await deployCloudflare(cwd, options);
    case 'deno':
      return await deployDeno(cwd, options);
    case 'vercel':
      return await deployVercel(cwd, options);
    case 'node':
      return await deployNode(cwd, options);
    default:
      throw new Error(`Unknown adapter: ${adapter}`);
  }
}

/**
 * Deploy to Cloudflare Workers
 */
async function deployCloudflare(cwd: string, options: DeployOptions): Promise<string | null> {
  // Check if wrangler is installed
  try {
    await execa('npx', ['wrangler', '--version'], { cwd });
  } catch (error) {
    throw new Error('Wrangler CLI not found. Install with: npm install -D wrangler');
  }

  // Deploy using wrangler
  const args = ['wrangler', 'deploy'];
  
  if (!options.production) {
    // Wrangler deploys to production by default, use environment for preview
    args.push('--env', 'preview');
  }

  const result = await execa('npx', args, {
    cwd,
    stdio: 'pipe'
  });

  // Extract URL from wrangler output
  const urlMatch = result.stdout.match(/https:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : null;
}

/**
 * Deploy to Deno Deploy
 */
async function deployDeno(cwd: string, options: DeployOptions): Promise<string | null> {
  // Check if deployctl is installed
  try {
    await execa('deno', ['run', '--version'], { cwd });
  } catch (error) {
    throw new Error('Deno CLI not found. Install from: https://deno.land/');
  }

  // Read deno.json for project name
  const denoJsonPath = path.join(cwd, 'deno.json');
  let projectName = 'my-edge-app';
  
  if (await fs.pathExists(denoJsonPath)) {
    const denoJson = await fs.readJson(denoJsonPath);
    projectName = denoJson.name || projectName;
  }

  // Deploy using deployctl
  const args = [
    'run',
    '-A',
    'https://deno.land/x/deploy/deployctl.ts',
    'deploy',
    '--project=' + projectName,
    'src/adapters/deno/server.ts'
  ];

  if (options.production) {
    args.push('--prod');
  }

  const result = await execa('deno', args, {
    cwd,
    stdio: 'pipe'
  });

  // Extract URL from deployctl output
  const urlMatch = result.stdout.match(/https:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : null;
}

/**
 * Deploy to Vercel
 */
async function deployVercel(cwd: string, options: DeployOptions): Promise<string | null> {
  // Check if vercel CLI is installed
  try {
    await execa('npx', ['vercel', '--version'], { cwd });
  } catch (error) {
    throw new Error('Vercel CLI not found. Install with: npm install -g vercel');
  }

  // Deploy using vercel CLI
  const args = ['vercel'];
  
  if (options.production) {
    args.push('--prod');
  }

  const result = await execa('npx', args, {
    cwd,
    stdio: 'pipe'
  });

  // Extract URL from vercel output
  const urlMatch = result.stdout.match(/https:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : null;
}

/**
 * Deploy to Node.js (typically means starting the server)
 */
async function deployNode(cwd: string, options: DeployOptions): Promise<string | null> {
  console.log(chalk.yellow('\n⚠️  Node.js deployment requires manual setup'));
  console.log(chalk.dim('\nTypical deployment options:'));
  console.log(chalk.dim('  • Use PM2: pm2 start dist/node/server.js'));
  console.log(chalk.dim('  • Use systemd service'));
  console.log(chalk.dim('  • Use Docker container'));
  console.log(chalk.dim('  • Deploy to platforms like Railway, Render, or Fly.io\n'));

  // Check if PM2 is available
  try {
    await execa('pm2', ['--version'], { cwd });
    
    const usePm2 = await prompts({
      type: 'confirm' as const,
      name: 'value',
      message: 'Start with PM2?',
      initial: true
    });

    if (usePm2.value) {
      await execa('pm2', ['start', 'dist/node/server.js', '--name', 'edge-app'], {
        cwd,
        stdio: 'inherit'
      });
      
      console.log(chalk.green('\n✅ Started with PM2'));
      console.log(chalk.dim('  • View logs: pm2 logs edge-app'));
      console.log(chalk.dim('  • Stop: pm2 stop edge-app'));
      console.log(chalk.dim('  • Restart: pm2 restart edge-app\n'));
      
      return 'http://localhost:3000';
    }
  } catch (error) {
    // PM2 not available
  }

  return null;
}
